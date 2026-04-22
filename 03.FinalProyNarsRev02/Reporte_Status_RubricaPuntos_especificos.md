# REPORTE STATUS RÚBRICA

## III.1 Context API + useReducer
* Estado: Cumple
* Evidencia: `ecommerce-app-Nars/src/contexts/CartContext.jsx`
* Nota: Implementado correctamente usando `createContext` y `useReducer` para la gestión del carrito.

## III.2 React Query (TanStack)
* Estado: Cumple
* Evidencia: `ecommerce-app-Nars/src/pages/HomePage.jsx`
* Nota: Se utiliza `useQuery` para el data fetching eficiente y caché del servidor.

## III.3 Interceptores Axios
* Estado: Cumple
* Evidencia: `ecommerce-app-Nars/src/api/apiClient.js`
* Nota: Interceptores configurados para inyectar headers de autenticación y manejo de errores.

## III.4 Rutas protegidas
* Estado: Cumple
* Evidencia: `ecommerce-app-Nars/src/App.jsx`
* Nota: Implementadas y aplicadas a través de los componentes envoltorio `<PrivateRoute>` y `<AdminRoute>`.

## III.5 Custom hooks
* Estado: Cumple
* Evidencia: `ecommerce-app-Nars/src/hooks/useWishlistActions.js`
* Nota: Múltiples hooks en la carpeta `hooks` centralizando la lógica de negocio reutilizable.

## III.6 Formularios controlados con validación
* Estado: Cumple
* Evidencia: `ecommerce-app-Nars/src/pages/LoginPage.jsx`
* Nota: Uso de estado local (`useState`) e invocación de validadores (`validateLoginForm`) antes del submit.

## III.7 Lazy loading
* Estado: Cumple
* Evidencia: `ecommerce-app-Nars/src/App.jsx`
* Nota: Division de código (code-splitting) aplicada a rutas mediante `React.lazy` y `<Suspense>`.

## III.8 Estados de carga y error
* Estado: Cumple
* Evidencia: `ecommerce-app-Nars/src/pages/HomePage.jsx`
* Nota: UI condicionada adecuadamente a las variables `isLoading` y `error` devueltas por React Query.

## IV.1 Diseño responsivo
* Estado: Cumple
* Evidencia: `ecommerce-app-Nars/src/index.css` y archivos `.css`
* Nota: Uso generalizado de `@media queries` para asegurar correcta visualización multisección.

## IV.2 Pruebas unitarias
* Estado: Cumple
* Evidencia: `ecommerce-app-Nars/src/pages/__tests__/CartPage.test.jsx`
* Nota: Suites construidas con Vitest/Testing Library cubriendo contextos y páginas clave.

## IV.3 Pruebas E2E
* Estado: Cumple
* Evidencia: `ecommerce-app-Nars/cypress/e2e/goldenPath.cy.js`
* Nota: Extensos flujos End-to-End cubriendo desde autenticación hasta checkout con Cypress.

## RESUMEN GENERAL

* Cumplimiento estimado (%): 100%
* Riesgos (máx 3): 
  - Sincronización de mock data en tests con los de producción.
  - Costo de mantenimiento en tests E2E ante futuros cambios drásticos de UI.
* Recomendación final: Arquitectura sólida y madura que acata todos los puntos exigidos de manera impecable.

## EXPLICACIÓN DETALLADA DE LOS PUNTOS EVALUADOS

### III.1 Context API + useReducer
Se empleó **Context API** (`createContext`) en conjunto con el hook `useReducer` para la gestión del estado global del carrito de compras y de la interfaz de usuario. Esta combinación permite evitar el "prop drilling" (pasar propiedades a través de múltiples niveles de componentes) y manejar lógicas de estado complejas mediante acciones despachadas (`dispatch`), manteniendo un flujo predecible en toda la aplicación.

### III.2 React Query (TanStack)
La librería **React Query** se incorporó para optimizar el *data fetching* (la recuperación de datos desde el backend) y manejar la caché del lado del cliente. Gracias a hooks como `useQuery`, la aplicación no tiene que almacenar manualmente la respuesta del servidor en estados locales complejos. React Query se encarga automáticamente de sincronizar los datos, invalidar la caché cuando es necesario, y proveer estados útiles listos para usar (`isLoading`, `isError`, etc.).

### III.3 Interceptores Axios
Se configuraron interceptores globales utilizando **Axios**. El interceptor de peticiones (*request*) se asegura de inyectar automáticamente el token de autenticación del usuario en los *headers* de cada llamada a la API. El interceptor de respuestas (*response*) permite capturar de manera centralizada errores del servidor (por ejemplo, tokens expirados 401), facilitando cierres de sesión automáticos o refrescos sin tener que repetir el código en cada petición individual.

### III.4 Rutas protegidas
Para la seguridad de las vistas en el frontend, se implementaron componentes de orden superior que actúan como guardianes de las rutas. Componentes como `<PrivateRoute>` o `<AdminRoute>` verifican en tiempo real si el usuario está autenticado y si cuenta con el rol requerido antes de renderizar la página. De no cumplir con las reglas, bloquean el acceso y redirigen al usuario a la vista correspondiente.

### III.5 Custom hooks
La extracción de lógica compleja y repetitiva en **Custom Hooks** es una excelente práctica de modularización observada. Esto permite que componentes puramente visuales se enfoquen únicamente en renderizar UI, delegando toda la lógica de negocio, cálculos o invocaciones asíncronas de la API a estos hooks encapsulados (como `useWishlistActions`), incrementando considerablemente la reusabilidad y limpieza del código de la vista.

### III.6 Formularios controlados con validación
La gestión de entradas de usuario se ha implementado mediante **formularios controlados**. Cada campo del formulario está vinculado a variables del estado local en React (`useState`), actualizándose a cada pulsación de tecla (`onChange`). Previo a su envío, los datos capturados pasan por funciones de validación aisladas que detectan correos inválidos, contraseñas cortas o campos vacíos, mostrando los errores en la interfaz antes de contactar a la API.

### III.7 Lazy loading
El uso de **Lazy Loading** (carga perezosa) permite dividir el empaquetado del código en trozos más pequeños (*Code Splitting*). Gracias a `React.lazy()` y al componente `<Suspense>`, los archivos correspondientes a las diferentes vistas solo se descargan de la red al momento de que el usuario navega a dichas páginas por primera vez, optimizando el tiempo de carga inicial y reduciendo significativamente el peso del empaquetado principal.

### III.8 Estados de carga y error
El manejo y la provisión visual de *feedback* al usuario sobre lo que ocurre internamente se han implementado exitosamente. Apoyándose en las propiedades que expone React Query u otros estados locales, la interfaz gráfica presenta *loaders* (animaciones de carga), mensajes de error explícitos o interfaces *Skeleton* cuando una solicitud se demora o falla, contribuyendo directamente a una mejor Experiencia de Usuario (UX).

### IV.1 Diseño responsivo
La aplicación incorpora un esquema de estilización usando directivas `@media queries` en sus archivos CSS. Se han programado reglas claras que transforman el *layout* y tamaño de los componentes basándose en la resolución de la pantalla del dispositivo. Esto asegura una adaptabilidad visual y funcional óptima tanto para pantallas táctiles pequeñas (celulares) como para monitores amplios (computadoras de escritorio).

### IV.2 Pruebas unitarias
El nivel de testeo automatizado a bajo nivel es óptimo. Con el uso de herramientas como **Vitest** en combinación con **React Testing Library**, se han programado aserciones (*tests*) que aíslan componentes o contextos específicos de la app para asegurar que, dadas ciertas propiedades de entrada, el sistema responda con el comportamiento lógico y renderizado visual correcto en un entorno simulado de navegador (DOM).

### IV.3 Pruebas E2E
Las **Pruebas End-to-End (E2E)** realizadas mediante **Cypress** levantan la aplicación entera en un navegador real y simulan la interacción de un usuario humano automatizado. Estos *tests* son cruciales porque navegan, escriben, e interactúan a lo largo de varias vistas y se cercioran de que las piezas (Frontend, Base de datos y API) funcionen orgánicamente en conjunto, minimizando así drásticamente los fallos de regresión en despliegues.
