# Auditoria Post-Implementacion MP-01

## 1) Cambios reales en el codigo

### Diff exacto - `ecommerce-app-Nars/src/pages/__tests__/LoginPage.test.jsx`

```diff
diff --git a/ecommerce-app-Nars/src/pages/__tests__/LoginPage.test.jsx b/ecommerce-app-Nars/src/pages/__tests__/LoginPage.test.jsx
new file mode 100644
--- /dev/null
+++ b/ecommerce-app-Nars/src/pages/__tests__/LoginPage.test.jsx
@@
+import { describe, it, expect, vi, beforeEach } from "vitest";
+import { render, screen, waitFor } from "@testing-library/react";
+import userEvent from "@testing-library/user-event";
+import { MemoryRouter, Route, Routes } from "react-router-dom";
+
+const { navigateMock, loginMock } = vi.hoisted(() => ({
+  navigateMock: vi.fn(),
+  loginMock: vi.fn(),
+}));
+
+vi.mock("react-router-dom", async () => {
+  const actual = await vi.importActual("react-router-dom");
+  return {
+    ...actual,
+    useNavigate: () => navigateMock,
+  };
+});
+
+vi.mock("../../contexts/AuthContext", () => ({
+  useAuth: vi.fn(),
+}));
+
+import { LoginPage } from "../LoginPage";
+import { useAuth } from "../../contexts/AuthContext";
+
+function renderPage(initialEntries = ["/login"]) {
+  return render(
+    <MemoryRouter initialEntries={initialEntries}>
+      <Routes>
+        <Route path="/login" element={<LoginPage />} />
+      </Routes>
+    </MemoryRouter>
+  );
+}
+
+describe("LoginPage", () => {
+  beforeEach(() => {
+    vi.clearAllMocks();
+    useAuth.mockReturnValue({
+      login: loginMock,
+      error: null,
+    });
+    loginMock.mockResolvedValue(true);
+  });
+
+  it("renderiza el formulario con credenciales de prueba precargadas", () => {
+    renderPage();
+
+    expect(screen.getByRole("heading", { name: "Iniciar sesión" })).toBeInTheDocument();
+    expect(screen.getByTestId("input-email")).toHaveValue("ali.ramos@mail.com");
+    expect(screen.getByTestId("input-password")).toHaveValue("123456");
+    expect(screen.getByTestId("btn-entrar")).toHaveTextContent("Entrar");
+  });
+
+  it("envia email y password al autenticarse correctamente", async () => {
+    const user = userEvent.setup();
+    renderPage();
+
+    await user.clear(screen.getByTestId("input-email"));
+    await user.type(screen.getByTestId("input-email"), "cliente@mail.com");
+    await user.clear(screen.getByTestId("input-password"));
+    await user.type(screen.getByTestId("input-password"), "secret123");
+    await user.click(screen.getByTestId("btn-entrar"));
+
+    expect(loginMock).toHaveBeenCalledWith("cliente@mail.com", "secret123");
+    await waitFor(() => {
+      expect(navigateMock).toHaveBeenCalledWith("/", { replace: true });
+    });
+  });
+
+  it("redirige a la ruta original cuando viene desde una pagina protegida", async () => {
+    const user = userEvent.setup();
+    renderPage([{ pathname: "/login", state: { from: { pathname: "/orders" } } }]);
+
+    await user.click(screen.getByTestId("btn-entrar"));
+
+    await waitFor(() => {
+      expect(navigateMock).toHaveBeenCalledWith("/orders", { replace: true });
+    });
+  });
+
+  it("no navega cuando login devuelve false y muestra error del contexto", async () => {
+    const user = userEvent.setup();
+    loginMock.mockResolvedValue(false);
+    useAuth.mockReturnValue({
+      login: loginMock,
+      error: "Credenciales inválidas",
+    });
+
+    renderPage();
+    await user.click(screen.getByTestId("btn-entrar"));
+
+    expect(loginMock).toHaveBeenCalledTimes(1);
+    expect(navigateMock).not.toHaveBeenCalled();
+    expect(screen.getByText("Credenciales inválidas")).toBeInTheDocument();
+  });
+
+  it("deshabilita el boton y muestra estado de envio mientras procesa", async () => {
+    const user = userEvent.setup();
+    let resolveLogin;
+    loginMock.mockReturnValue(
+      new Promise((resolve) => {
+        resolveLogin = resolve;
+      })
+    );
+
+    renderPage();
+    await user.click(screen.getByTestId("btn-entrar"));
+
+    expect(screen.getByTestId("btn-entrar")).toBeDisabled();
+    expect(screen.getByTestId("btn-entrar")).toHaveTextContent("Validando...");
+
+    resolveLogin(true);
+
+    await waitFor(() => {
+      expect(screen.getByTestId("btn-entrar")).not.toBeDisabled();
+    });
+    expect(screen.getByTestId("btn-entrar")).toHaveTextContent("Entrar");
+  });
+});
```

### Diff exacto - `ecommerce-app-Nars/src/pages/__tests__/RegisterPage.test.jsx`

```diff
diff --git a/ecommerce-app-Nars/src/pages/__tests__/RegisterPage.test.jsx b/ecommerce-app-Nars/src/pages/__tests__/RegisterPage.test.jsx
new file mode 100644
--- /dev/null
+++ b/ecommerce-app-Nars/src/pages/__tests__/RegisterPage.test.jsx
@@
+import { describe, it, expect, vi, beforeEach } from "vitest";
+import { render, screen, waitFor } from "@testing-library/react";
+import userEvent from "@testing-library/user-event";
+import { MemoryRouter, Route, Routes } from "react-router-dom";
+
+const { navigateMock, registerMock, persistAuthSessionMock, restoreSessionMock } = vi.hoisted(() => ({
+  navigateMock: vi.fn(),
+  registerMock: vi.fn(),
+  persistAuthSessionMock: vi.fn(),
+  restoreSessionMock: vi.fn(),
+}));
+
+vi.mock("react-router-dom", async () => {
+  const actual = await vi.importActual("react-router-dom");
+  return {
+    ...actual,
+    useNavigate: () => navigateMock,
+  };
+});
+
+vi.mock("../../api/authApi", () => ({
+  authApi: {
+    register: registerMock,
+  },
+}));
+
+vi.mock("../../services/authService", () => ({
+  persistAuthSession: persistAuthSessionMock,
+}));
+
+vi.mock("../../contexts/AuthContext", () => ({
+  useAuth: vi.fn(),
+}));
+
+import { RegisterPage } from "../RegisterPage";
+import { useAuth } from "../../contexts/AuthContext";
+
+function renderPage() {
+  return render(
+    <MemoryRouter initialEntries={["/register"]}>
+      <Routes>
+        <Route path="/register" element={<RegisterPage />} />
+      </Routes>
+    </MemoryRouter>
+  );
+}
+
+async function fillForm(user) {
+  await user.type(screen.getByTestId("input-name"), "Jane Doe");
+  await user.type(screen.getByTestId("input-email"), "jane@mail.com");
+  await user.type(screen.getByTestId("input-password"), "secret123");
+}
+
+describe("RegisterPage", () => {
+  beforeEach(() => {
+    vi.clearAllMocks();
+    useAuth.mockReturnValue({
+      restoreSession: restoreSessionMock,
+    });
+    registerMock.mockResolvedValue({
+      accessToken: "access-token",
+      refreshToken: "refresh-token",
+      user: {
+        id: "user-1",
+        displayName: "Jane Doe",
+        email: "jane@mail.com",
+      },
+    });
+  });
+
+  it("renderiza el formulario de registro con sus campos principales", () => {
+    renderPage();
+
+    expect(screen.getByRole("heading", { name: "Crear cuenta" })).toBeInTheDocument();
+    expect(screen.getByTestId("input-name")).toHaveValue("");
+    expect(screen.getByTestId("input-email")).toHaveValue("");
+    expect(screen.getByTestId("input-password")).toHaveValue("");
+    expect(screen.getByRole("link", { name: /inicia sesión aquí/i })).toHaveAttribute("href", "/login");
+  });
+
+  it("registra al usuario, persiste la sesion y redirige al inicio", async () => {
+    const user = userEvent.setup();
+    renderPage();
+
+    await fillForm(user);
+    await user.click(screen.getByTestId("btn-crear-cuenta"));
+
+    expect(registerMock).toHaveBeenCalledWith({
+      displayName: "Jane Doe",
+      email: "jane@mail.com",
+      password: "secret123",
+    });
+
+    await waitFor(() => {
+      expect(persistAuthSessionMock).toHaveBeenCalledTimes(1);
+      expect(restoreSessionMock).toHaveBeenCalledWith({
+        id: "user-1",
+        displayName: "Jane Doe",
+        email: "jane@mail.com",
+      });
+      expect(navigateMock).toHaveBeenCalledWith("/");
+    });
+  });
+
+  it("muestra el mensaje remoto de error cuando la API responde con detalle", async () => {
+    const user = userEvent.setup();
+    registerMock.mockRejectedValue({
+      response: {
+        data: {
+          message: "El correo ya está registrado",
+        },
+      },
+    });
+
+    renderPage();
+    await fillForm(user);
+    await user.click(screen.getByTestId("btn-crear-cuenta"));
+
+    expect(await screen.findByText("El correo ya está registrado")).toBeInTheDocument();
+    expect(persistAuthSessionMock).not.toHaveBeenCalled();
+    expect(navigateMock).not.toHaveBeenCalled();
+  });
+
+  it("usa un mensaje fallback cuando la API falla sin detalle", async () => {
+    const user = userEvent.setup();
+    registerMock.mockRejectedValue(new Error("network down"));
+
+    renderPage();
+    await fillForm(user);
+    await user.click(screen.getByTestId("btn-crear-cuenta"));
+
+    expect(await screen.findByText("Error al crear la cuenta. Intenta con otro correo.")).toBeInTheDocument();
+  });
+
+  it("deshabilita el boton y muestra estado de carga mientras crea la cuenta", async () => {
+    const user = userEvent.setup();
+    let resolveRegister;
+    registerMock.mockReturnValue(
+      new Promise((resolve) => {
+        resolveRegister = resolve;
+      })
+    );
+
+    renderPage();
+    await fillForm(user);
+    await user.click(screen.getByTestId("btn-crear-cuenta"));
+
+    expect(screen.getByTestId("btn-crear-cuenta")).toBeDisabled();
+    expect(screen.getByTestId("btn-crear-cuenta")).toHaveTextContent("Creando...");
+
+    resolveRegister({
+      accessToken: "access-token",
+      refreshToken: "refresh-token",
+      user: {
+        id: "user-1",
+        displayName: "Jane Doe",
+      },
+    });
+
+    await waitFor(() => {
+      expect(screen.getByTestId("btn-crear-cuenta")).not.toBeDisabled();
+    });
+    expect(screen.getByTestId("btn-crear-cuenta")).toHaveTextContent("Registrarme");
+  });
+});
```

### Confirmacion explicita de archivos de produccion

- `ecommerce-app-Nars/src/pages/LoginPage.jsx`: no fue modificado.
- `ecommerce-app-Nars/src/pages/RegisterPage.jsx`: no fue modificado.

Evidencia: `git status --short` solo reporta los dos archivos nuevos de tests; no reporta cambios en `LoginPage.jsx` ni `RegisterPage.jsx`.

## 2) Validacion de contratos

### Confirmacion de no cambios

- `auth`: no hubo cambios en payloads, endpoints ni manejo de tokens.
- `cart`: no hubo cambios.
- `checkout`: no hubo cambios.

### Como se asegura tecnicamente

- MP-01 solo agrega dos archivos nuevos bajo `ecommerce-app-Nars/src/pages/__tests__/`.
- No se modificaron `ecommerce-app-Nars/src/api/authApi.js`, `ecommerce-app-Nars/src/services/authService.js`, `ecommerce-app-Nars/src/contexts/AuthContext.jsx`, `ecommerce-app-Nars/src/contexts/CartContext.jsx`, `ecommerce-app-Nars/src/api/orderApi.js` ni paginas de checkout/cart.
- Los tests usan mocks sobre `useAuth`, `authApi.register`, `persistAuthSession` y `useNavigate`; eso aísla el test y evita tocar contratos reales.
- `git status --short` de archivos auditados confirma que el cambio real esta restringido a archivos de test nuevos.

## 3) Calidad de los tests

### `describe()` y casos implementados

#### `describe("LoginPage")`

1. `renderiza el formulario con credenciales de prueba precargadas`
2. `envia email y password al autenticarse correctamente`
3. `redirige a la ruta original cuando viene desde una pagina protegida`
4. `no navega cuando login devuelve false y muestra error del contexto`
5. `deshabilita el boton y muestra estado de envio mientras procesa`

#### `describe("RegisterPage")`

1. `renderiza el formulario de registro con sus campos principales`
2. `registra al usuario, persiste la sesion y redirige al inicio`
3. `muestra el mensaje remoto de error cuando la API responde con detalle`
4. `usa un mensaje fallback cuando la API falla sin detalle`
5. `deshabilita el boton y muestra estado de carga mientras crea la cuenta`

### Clasificacion por tipo

#### Exito

- Login: render base, submit exitoso, redireccion a ruta original.
- Register: render base, submit exitoso con persistencia de sesion y redireccion.

#### Error

- Login: error desde contexto cuando `login` devuelve `false`.
- Register: error remoto con `response.data.message`; error fallback sin detalle.

#### Edge cases

- Login: redireccion condicionada a `location.state.from.pathname`.
- Login: estado pending con promesa manual.
- Register: estado pending con promesa manual.

### Deteccion de problemas de calidad

#### Mocks excesivos

- `LoginPage.test.jsx`: moderados. Se mockea `useAuth` y `useNavigate`; es aceptable para un test de componente aislado.
- `RegisterPage.test.jsx`: altos. Se mockean `useNavigate`, `authApi.register`, `persistAuthSession` y `useAuth`. Esto aumenta aislamiento, pero tambien reduce realismo del flujo.

#### Tests fragiles

- Dependencia en textos exactos de botones y mensajes (`Entrar`, `Validando...`, `Creando...`, mensajes de error). Si cambia copy, pueden fallar sin cambio funcional real.
- Dependencia en `data-testid` concretos. Es estable si el equipo los considera contrato de testing; si no, es otro punto fragil.
- El test de login asume las credenciales prellenadas actuales; si luego se eliminan por UX, ese test fallara aunque el flujo siga sano.

#### Tests que no validan comportamiento real

- Login no valida integracion real con `authService` ni `authApi`; valida solo el comportamiento del componente frente al contrato del contexto.
- Register no valida el wiring real con `authApi.register` ni `persistAuthSession`; ambos estan mockeados.
- Ninguno valida side effects reales en `localStorage` ni interceptores.
- Por lo tanto, estos tests sirven para rubrica de componente/pagina, pero no reemplazan pruebas de integracion.

## 4) Cobertura funcional real

### Login completo

- Cubierto parcialmente.
- Si cubre: render, captura de inputs, submit, llamada a `login(email, password)`, bloqueo de boton durante pending, redireccion cuando login resuelve `true`, permanencia cuando resuelve `false`.
- No cubre: integracion real con `authService`, persistencia real de sesion, manejo real de errores HTTP, refresh token, logout, `localStorage`.

### Register completo

- Cubierto parcialmente.
- Si cubre: render, captura de nombre/email/password, submit, llamada con payload esperado, `persistAuthSession`, `restoreSession`, redireccion a `/`, mensaje remoto, mensaje fallback y estado pending.
- No cubre: request real a backend, persistencia real en `localStorage`, integracion real con `AuthContext` completo, errores de validacion HTML del navegador.

### Manejo de errores backend

- Cubierto parcialmente por simulacion.
- Register cubre dos variantes utiles: error con `response.data.message` y error generico sin detalle.
- Login cubre solo el caso donde el contexto ya entrega `error`; no cubre la forma del error HTTP original.

### Estados loading

- Cubiertos en ambos formularios con promesas manuales.
- Se valida deshabilitacion del boton y cambio visible de texto.
- No se valida bloqueo de doble submit ni estados de campos individuales.

### Navegacion

- Login cubre navegacion a `/` y a `from.pathname`.
- Register cubre navegacion a `/` tras exito.
- No se cubren loops de navegacion ni proteccion de rutas externas.

## 5) Riesgos tecnicos

### Acoplamiento a implementacion interna

- `LoginPage.test.jsx` esta acoplado al hecho de que `LoginPage` usa `useAuth().login` y `useAuth().error` directamente.
- `RegisterPage.test.jsx` esta acoplado a que `RegisterPage` llama `authApi.register`, luego `persistAuthSession`, luego `restoreSession`, luego `navigate("/")` en ese orden logico.
- Si se refactoriza la pagina para mover logica a un hook o servicio intermedio, varios tests seguiran pasando solo si se preserva esa implementacion interna, aunque el comportamiento visible al usuario sea el mismo.

### Dependencia de mocks no realistas

- Alta en `RegisterPage.test.jsx`: el mock de `authApi.register` asume estructura exacta de respuesta exitosa y error, pero no verifica headers, latencia real, side effects reales ni schema backend completo.
- Media en `LoginPage.test.jsx`: el mock de `useAuth` es realista a nivel de interfaz, pero no prueba que `AuthContext` entregue esa interfaz correctamente.

### Falsos positivos

- Posibles en ambos archivos porque el sistema real de auth no participa.
- Ejemplo: si `authApi.register` rompiera su import o `persistAuthSession` dejara de guardar tokens bien, `RegisterPage.test.jsx` seguiria pasando porque ambos estan mockeados.
- Ejemplo: si `AuthContext.login` cambiara de firma o comportamiento interno pero el mock siguiera respondiendo `true/false`, `LoginPage.test.jsx` seguiria verde.

## 6) Validacion ejecutada

### `npm test`

Paso sin fallos.

```text
> ramdi-jewelry-ecommerce-css@1.0.0 test
> vitest run

RUN v4.1.1 D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-app-Nars

Test Files  8 passed (8)
Tests       39 passed (39)
Start at    12:21:00
Duration    14.33s (transform 1.65s, setup 3.51s, import 6.62s, tests 14.41s, environment 22.77s)
```

### `npm run build`

Paso sin fallos.

```text
> ramdi-jewelry-ecommerce-css@1.0.0 build
> vite build

vite v6.4.1 building for production...
transforming...
✓ 139 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                  0.50 kB │ gzip:  0.33 kB
dist/assets/index-H3lYmK6F.css  25.83 kB │ gzip:  5.55 kB
dist/assets/index-DHMwjGgt.js  256.96 kB │ gzip: 82.66 kB
✓ built in 3.79s
```

### Warnings criticos

- No aparecen warnings criticos en las salidas capturadas.

## 7) Conclusion tecnica

Clasificacion: `SEGURO con observaciones`.

### Motivo de la clasificacion

- Seguro porque el cambio real no toca codigo de produccion ni contratos, y test/build siguen verdes.
- Con observaciones porque la cobertura lograda es principalmente de componente aislado, no de integracion real; en especial `RegisterPage.test.jsx` depende de varios mocks y puede ocultar roturas reales en `authApi` o `persistAuthSession`.

## 8) Recomendacion

- Se puede avanzar a `MP-02` si el objetivo es seguir cerrando rubrica sin bloquear el flujo.
- No hace falta corregir MP-01 antes de continuar para mantener estabilidad.
- Aun asi, conviene registrar una observacion tecnica: mas adelante seria deseable agregar al menos una prueba de integracion ligera para auth que no mockee simultaneamente `authApi`, `persistAuthSession` y `AuthContext`.

## Anexo de terminal

### Comando

```text
git status --short -- "ecommerce-app-Nars/src/pages/LoginPage.jsx" "ecommerce-app-Nars/src/pages/RegisterPage.jsx" "ecommerce-app-Nars/src/pages/__tests__/LoginPage.test.jsx" "ecommerce-app-Nars/src/pages/__tests__/RegisterPage.test.jsx"
```

### Salida

```text
?? ecommerce-app-Nars/src/pages/__tests__/LoginPage.test.jsx
?? ecommerce-app-Nars/src/pages/__tests__/RegisterPage.test.jsx
```

### Comando

```text
npm test
```

### Salida

```text
> ramdi-jewelry-ecommerce-css@1.0.0 test
> vitest run

RUN v4.1.1 D:/MyDocuments/2025.Inadaptados/Nars2025-2-REACT-Integracion/03.FinalProyNarsRev02/ecommerce-app-Nars

Test Files  8 passed (8)
Tests       39 passed (39)
Start at    12:21:00
Duration    14.33s (transform 1.65s, setup 3.51s, import 6.62s, tests 14.41s, environment 22.77s)
```

### Comando

```text
npm run build
```

### Salida

```text
> ramdi-jewelry-ecommerce-css@1.0.0 build
> vite build

vite v6.4.1 building for production...
transforming...
✓ 139 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                  0.50 kB │ gzip:  0.33 kB
dist/assets/index-H3lYmK6F.css  25.83 kB │ gzip:  5.55 kB
dist/assets/index-DHMwjGgt.js  256.96 kB │ gzip: 82.66 kB
✓ built in 3.79s
```
