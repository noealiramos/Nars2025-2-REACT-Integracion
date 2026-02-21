import { chromium } from 'patchright';
import path from 'path';
import { CONFIG } from './dist/config.js';

async function main() {
    console.log("🚀 Launching browser to list NotebookLM notebooks...");

    // Use the SAME persistent profile as the MCP server
    const context = await chromium.launchPersistentContext(CONFIG.chromeProfileDir, {
        headless: true,
        channel: "chrome",
        args: [
            "--disable-blink-features=AutomationControlled",
        ],
    });

    const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

    try {
        console.log("🌐 Navigating to NotebookLM...");
        await page.goto("https://notebooklm.google.com/", { waitUntil: 'networkidle', timeout: 60000 });

        console.log("📸 Taking screenshot...");
        await page.screenshot({ path: 'notebook-list.png' });

        console.log("⏳ Waiting for content to settle...");
        await page.waitForTimeout(10000);

        // Diagnostic: Dump text content
        const bodyText = await page.innerText('body');
        console.log("Body text preview:", bodyText.substring(0, 500));

        const notebookNames = ["ecommerceProyR01", "notebook de Prueba NotasImp3D", "prueba IA comparativa"];
        for (const name of notebookNames) {
            const found = bodyText.includes(name);
            console.log(`Notebook "${name}" found in body text: ${found}`);
        }

        const notebooks = await page.evaluate(() => {
            const results = [];
            const seenUrls = new Set();

            function processElement(el) {
                // 1. Check if it's a link
                if (el.tagName === 'A') {
                    const href = el.getAttribute('href') || '';
                    if (href.includes('/notebook/')) {
                        const url = href.startsWith('http') ? href : `https://notebooklm.google.com${href}`;
                        if (!seenUrls.has(url)) {
                            results.push({ name: el.innerText.trim().split('\n')[0], url });
                            seenUrls.add(url);
                        }
                    }
                }

                // 2. Check ALL attributes for notebook URL patterns
                const attrs = el.attributes;
                if (attrs) {
                    for (let i = 0; i < attrs.length; i++) {
                        const attr = attrs[i];
                        if (attr.value && attr.value.includes('/notebook/')) {
                            // Extract the URL or ID
                            // Often it's just the ID or a path
                            let url = attr.value;
                            if (!url.startsWith('http')) {
                                // If it's a relative path or just the ID, try to construct a URL
                                if (url.startsWith('/notebook/')) {
                                    url = `https://notebooklm.google.com${url}`;
                                } else if (url.match(/^[a-zA-Z0-9_-]+$/)) {
                                    // Might be just the ID
                                    url = `https://notebooklm.google.com/notebook/${url}`;
                                }
                            }

                            if (url.includes('notebooklm.google.com/notebook/') && !seenUrls.has(url)) {
                                // Find a name nearby
                                const name = el.innerText.trim().split('\n')[0] || 'Unknown';
                                results.push({ name, url });
                                seenUrls.add(url);
                            }
                        }
                    }
                }

                // 3. Recursive shadow DOM check
                if (el.shadowRoot) {
                    const children = el.shadowRoot.querySelectorAll('*');
                    for (const child of children) {
                        processElement(child);
                    }
                }
            }

            const all = document.querySelectorAll('*');
            for (const el of all) {
                processElement(el);
            }

            return results;
        });

        if (notebooks.length === 0) {
            console.log("⚠️ No notebooks found with Link selectors.");
            // Log all links for debugging
            const allLinks = await page.evaluate(() => Array.from(document.querySelectorAll('a')).map(a => ({ href: a.href, text: a.innerText.trim() })));
            console.log("All links on page:", allLinks.filter(l => l.text.length > 0).slice(0, 20));
        }

        console.log("\n--------------------------------------------------");
        console.log(`Found ${notebooks.length} notebooks:`);
        notebooks.forEach((nb, i) => {
            console.log(`${i + 1}. ${nb.name}`);
            console.log(`   URL: ${nb.url}`);
        });
        console.log("--------------------------------------------------\n");

    } catch (err) {
        console.error("❌ Error listing notebooks:", err.message);
    } finally {
        await context.close();
    }
}

main().catch(console.error);
