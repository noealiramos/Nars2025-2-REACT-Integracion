import { AuthManager } from './dist/auth/auth-manager.js';
import { CONFIG } from './dist/config.js';

async function main() {
    const auth = new AuthManager();
    const sendProgress = (msg, p, t) => {
        console.log(`[${p}/${t}] ${msg}`);
    };

    console.log("--------------------------------------------------");
    console.log("NotebookLM MCP - Interactive Login Setup");
    console.log("--------------------------------------------------");
    console.log("A browser window should appear. Please login to your Google account.");
    console.log("The script will wait until you reach NotebookLM (https://notebooklm.google.com/).");
    console.log("Once detected, the browser will close and auth state will be saved.");
    console.log("--------------------------------------------------");

    // true for overrideHeadless means show browser
    const success = await auth.performSetup(sendProgress, true);

    if (success) {
        console.log("\n✅ Login successful!");
        console.log("Authentication state saved to:");
        console.log(`- ${CONFIG.chromeProfileDir}`);
        console.log("\nYou can now start the MCP server normally.");
    } else {
        console.log("\n❌ Login failed or timed out.");
    }
}

main().catch(err => {
    console.error("\nFATAL ERROR:", err);
    process.exit(1);
});
