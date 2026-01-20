# Sprint 5 — Deploy

## Semana 10 – Mi portafolio express

📌 Antes de empezar
- ¡Respira! Hacer deploy es más fácil de lo que parece: Git + click en "Deploy". 🚀
- Orden recomendado: Concepto → Esquema → Pasos 1–6 → Recursos.
- Clave: tu app pasa de `localhost` a una URL pública accesible desde cualquier lugar.
- Consejo: asegúrate de que funciona en local antes de desplegar. 🔍

🎯 Objetivo + Concepto (por qué + analogía)
- Objetivo: **Desplegar** una app React a un servicio de hosting estático (Vercel/Netlify) usando Git para integración continua. 🌐
- La metáfora de la mudanza (de casa privada a casa con dirección pública):
  - `localhost` = tu casa privada (solo tú puedes entrar).
  - Deploy = mudarte a una casa con dirección pública (cualquiera puede visitarte).
  - `npm run build` = empacar tus cosas (optimizar archivos para producción).
  - Vercel/Netlify = la empresa de mudanzas (toma tus archivos y los sube al servidor).
  - Git push = llamar a la empresa para que actualice automáticamente tu casa.
  - URL pública = nueva dirección que compartes con el mundo.
- Resultado: tu app disponible 24/7 desde cualquier navegador. ✨

📋 Esquema de código (estructura incompleta)
- Plantilla con huecos para completar —sin soluciones completas—.

```bash
# filepath: terminal (comandos de deploy)
# 1. Asegúrate de que el proyecto funciona en local
npm run dev
# Verifica que la app carga correctamente en http://localhost:5173

# 2. Crea un build de producción
npm run build
# Genera carpeta dist/ con archivos optimizados

# 3. Verifica que no hay errores en el build
# Tarea: revisa la consola. ¿Aparecieron warnings o errores?

# 4. Sube tu código a GitHub (si aún no lo hiciste)
git add .
git commit -m "Preparado para deploy"
git push origin main
```

```markdown
<!-- filepath: README.md (documentación del deploy) -->
# Mi Pokédex

## 🚀 Deploy

Esta aplicación está desplegada en: [PENDIENTE: añade tu URL aquí]

### Cómo se realizó el deploy

1. Se creó una cuenta en [Vercel/Netlify] <!-- Tarea: elige uno -->
2. Se conectó el repositorio de GitHub
3. Se configuró el build command: `npm run build`
4. Se configuró el output directory: `dist`
5. Se hizo click en "Deploy"

### Actualización automática

Cada vez que se hace `git push` a la rama `main`, el servicio:
- Detecta los cambios
- Ejecuta `npm install` y `npm run build`
- Actualiza la versión desplegada automáticamente (CI/CD)

## 🛠 Desarrollo local

```bash
npm install
npm run dev
```
```

```json
// filepath: package.json (scripts relevantes)
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

👇 Tu viaje — Pasos 1–6 (cada paso: concepto, tarea, verificación, tiempo)

Paso 1: Verifica que tu app funciona en local
⏱️ Tiempo estimado: 10 min
Conceptos clave:
- Si falla en local, fallará en producción.
- `npm run dev` = servidor de desarrollo con hot reload.
Tarea:
- Ejecuta `npm run dev`.
- Abre `http://localhost:5173`.
- Navega por todas las páginas/funcionalidades.
- Verifica que no hay errores en la consola del navegador.
Verificación:
- ¿Todas las funciones cargan correctamente?
- ¿Hay errores en la consola de DevTools?
- ¿Las imágenes y estilos se muestran bien?
Pista:
- Si hay errores 404 o paths rotos, corrígelos antes de continuar.

Paso 2: Crea el build de producción
⏱️ Tiempo estimado: 10 min
Conceptos clave:
- `npm run build` = compila, optimiza y minifica tu código.
- Genera carpeta `dist/` con HTML, JS y CSS optimizados.
- Build de producción es más rápido y ligero que dev.
Tarea:
- Ejecuta `npm run build`.
- Observa la salida en terminal: tamaño de archivos, warnings.
- Revisa que se creó la carpeta `dist/` con archivos dentro.
Verificación:
- ¿El build terminó sin errores?
- ¿La carpeta `dist/` contiene `index.html` y carpeta `assets/`?
- ¿Ves el tamaño de cada archivo (ej: "main-abc123.js (42.5 kB)")?
Pista:
- Si hay warnings de dependencias no usadas, ignóralos por ahora.

Paso 3: Previsualiza el build localmente (opcional pero recomendado)
⏱️ Tiempo estimado: 5 min
Conceptos clave:
- `npm run preview` = sirve la carpeta `dist/` en un servidor local.
- Simula el entorno de producción antes de desplegar.
Tarea:
- Ejecuta `npm run preview`.
- Abre la URL que aparece (ej: `http://localhost:4173`).
- Verifica que la app funciona igual que en `npm run dev`.
Verificación:
- ¿La app carga correctamente?
- ¿Las rutas funcionan? (prueba navegar entre páginas)
Pista:
- Si algo falla aquí, también fallará en el deploy real.

Paso 4: Sube tu código a GitHub
⏱️ Tiempo estimado: 10 min
Conceptos clave:
- Vercel/Netlify leen desde GitHub para obtener tu código.
- Cada push a la rama principal dispara un nuevo deploy.
Tarea:
- Si no tienes repositorio, crea uno en GitHub (público o privado).
- Ejecuta: `git add .`, `git commit -m "Listo para deploy"`, `git push origin main`.
- Verifica en GitHub que los archivos están subidos.
Verificación:
- ¿Ves tu código en GitHub?
- ¿Están todos los archivos necesarios? (src/, public/, package.json, vite.config.js)
- ¿Falta algún archivo crítico?
Pista:
- NO subas `node_modules/` (debe estar en `.gitignore`).

Paso 5: Conecta tu repositorio a Vercel o Netlify
⏱️ Tiempo estimado: 15 min
Conceptos clave:
- Ambos servicios ofrecen tier gratuito con CI/CD automático.
- Autodetectan configuración de Vite (build command, output dir).
Tarea (Vercel):
- Ve a [vercel.com](https://vercel.com), crea cuenta con GitHub.
- Click "New Project" → Importa tu repositorio.
- Verifica configuración: Build Command: `npm run build`, Output Directory: `dist`.
- Click "Deploy".
Tarea (Netlify):
- Ve a [netlify.com](https://netlify.com), crea cuenta con GitHub.
- Click "Add new site" → Import from Git → Selecciona repositorio.
- Verifica: Build command: `npm run build`, Publish directory: `dist`.
- Click "Deploy site".
Verificación:
- ¿El servicio comenzó a instalar dependencias?
- ¿Ves logs en pantalla ejecutando `npm install` y `npm run build`?
Pista:
- El primer deploy puede tardar 2–5 minutos.

Paso 6: Verifica y comparte tu URL pública
⏱️ Tiempo estimado: 10 min
Conceptos clave:
- Una vez desplegado, obtienes URL tipo `https://tu-proyecto.vercel.app`.
- La URL es permanente (puedes cambiar el dominio después).
Tarea:
- Copia la URL que aparece al finalizar el deploy.
- Ábrela en una pestaña de incógnito (para simular usuario nuevo).
- Compártela con un amigo o en tu teléfono.
Verificación:
- ¿La app carga correctamente desde la URL pública?
- ¿Funciona igual que en local?
- ¿Puedes acceder desde otro dispositivo?
Pista:
- Si algo falla, revisa los logs del deploy en Vercel/Netlify.

🎓 Después de terminar (reflexión)
- Escribe 2–3 frases: ¿qué diferencias notaste entre `npm run dev` y el build de producción?
- ¿Por qué es útil la integración continua (auto-deploy con cada push)?

🚀 Si quieres ir más allá (opcional)
- Configura un dominio personalizado (ej: `mi-pokedex.com`).
- Activa HTTPS automático (Vercel/Netlify lo incluyen gratis).
- Añade variables de entorno en el panel de Vercel/Netlify.
- Configura preview deploys: cada rama/PR genera URL temporal.
- Implementa analytics para ver cuántas visitas recibe tu app.
- Añade un badge en el README mostrando el estado del deploy.
- Prueba deploy en ambos servicios y compara velocidades.

📚 Recursos útiles
- Vercel Docs: Deploy Vite App
- Netlify Docs: Deploy Vite
- Vite Docs: Building for Production
- GitHub: About Pull Requests (para preview deploys)
- Web.dev: Optimizing Build Performance

✅ Entregable (lista)
- [ ] App funciona correctamente en local sin errores.
- [ ] Build de producción (`npm run build`) ejecuta sin errores.
- [ ] Código subido a GitHub con `.gitignore` correcto.
- [ ] URL pública accesible desde cualquier navegador.
- [ ] README actualizado con link al deploy y explicación del proceso.
- [ ] Opcional: configurado auto-deploy con cada push a main.

🎉 Celebración: si tu app tiene URL pública y cualquiera puede verla, ¡hiciste tu primer deploy! 🌍✨
