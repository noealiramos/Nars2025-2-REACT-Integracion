Entra en modo POST-EXECUTION VERIFICATION TOTAL.

OBJETIVO:
auditar de forma estricta si la ejecución asociada al prompt ubicado en:

D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\opencode\Prompt26.04.04.1208am.md

fue aplicada realmente al 100%, o si quedó algo parcial, omitido, interrumpido o solo documentado pero no ejecutado.

IMPORTANTE:
Durante la ejecución se presionó accidentalmente la tecla ESC.
Después se pidió continuar, pero NO se debe asumir que todo terminó bien.
Debes verificarlo con evidencia real.

==================================================
MODO DE TRABAJO OBLIGATORIO
==================================================

NO implementes cambios nuevos.
NO corrijas nada todavía.
NO avances a la siguiente iteración.
SOLO audita y verifica.

Debes comparar estas 3 cosas:

1) el prompt original:
- `D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\opencode\Prompt26.04.04.1208am.md`

2) la evidencia/documentación generada por esa ejecución
- localizar el `.md` de resultado correspondiente

3) el estado REAL actual del repositorio
- archivos realmente creados/modificados
- comportamiento realmente presente
- validaciones realmente corridas

==================================================
QUE DEBES VERIFICAR
==================================================

Para CADA instrucción relevante del prompt original, determinar:

- Estado:
  - CUMPLIDO
  - PARCIAL
  - NO EJECUTADO
  - DOCUMENTADO PERO NO COMPROBADO

- Evidencia REAL:
  - archivos
  - rutas
  - código
  - resultados de tests/build
  - comportamiento observable

- Observación:
  - si hubo interrupción potencial
  - si falta validación
  - si el documento afirma algo que no quedó realmente aplicado

==================================================
AUDITORIA OBLIGATORIA
==================================================

Debes revisar explícitamente:

1) si todos los archivos que debían crearse/modificarse realmente existen con el cambio esperado
2) si las rutas nuevas realmente quedaron conectadas
3) si los providers/contextos/hooks realmente quedaron integrados
4) si las vistas nuevas realmente existen y renderizan
5) si los endpoints usados por frontend realmente coinciden con el backend
6) si las validaciones prometidas realmente se ejecutaron
7) si hubo algo mencionado en el .md que NO tenga respaldo real
8) si algo quedó a medias por la interrupción con ESC

==================================================
VALIDACIONES MINIMAS OBLIGATORIAS
==================================================

Sin cambiar código, ejecuta solo verificaciones:

- inspección de archivos modificados
- revisión de imports/rutas/providers
- `npm test`
- `npm run build`

Y si el prompt original exigía validación funcional o sanity, confirmar si:
- ya se ejecutó realmente con evidencia
o
- falta ejecutarse

NO inventes evidencia.
NO des por hecho nada solo porque esté escrito en el .md.

==================================================
ENTREGABLE OBLIGATORIO
==================================================

Genera un único archivo nuevo:

- `docs/POST_EXECUTION_VERIFICATION-YYYY-MM-DD-HHmm.md`

Con esta estructura EXACTA:

# POST EXECUTION VERIFICATION - [timestamp]

## 1. Prompt auditado
Ruta exacta del prompt revisado.

## 2. Documento(s) de evidencia revisados
Lista de archivos .md revisados.

## 3. Verificación punto por punto
Para cada instrucción importante del prompt original:
- instrucción
- estado
- evidencia real
- observación

## 4. Verificación de archivos
Lista exacta de archivos que debían cambiar y su estado real:
- presente y correcto
- presente pero parcial
- ausente
- no comprobado

## 5. Verificación de integración
Confirmar:
- rutas
- providers
- componentes
- servicios/API
- consistencia frontend/backend

## 6. Verificación de validaciones
Qué sí se ejecutó realmente:
- npm test
- npm run build
- sanity/E2E si aplica

Qué NO se puede confirmar.

## 7. Conclusión honesta
Elegir SOLO una:
- EJECUCION 100% CONFIRMADA
- EJECUCION MAYORMENTE COMPLETA, CON HUECOS MENORES
- EJECUCION PARCIAL
- EJECUCION NO CONFIABLE

## 8. Huecos detectados
Solo si existen.

## 9. Siguiente paso recomendado
Debe ser uno de estos:
- continuar con la siguiente iteración
- completar huecos faltantes
- reejecutar la iteración
- validar funcionalmente antes de continuar

==================================================
REGLA DE TRAZABILIDAD
==================================================

TODO lo que escribas en terminal debe quedar reflejado también en el .md.

No puede haber conclusiones en terminal que no estén documentadas.

==================================================
FORMATO DE SALIDA FINAL EN TERMINAL
==================================================

1) RESULTADO:
- VERIFIED / PARTIAL / UNRELIABLE

2) ARCHIVO GENERADO:
- ruta completa del .md

3) CONCLUSION HONESTA:
- una sola línea

4) SIGUIENTE PASO:
- una sola línea

NO cambies código.
NO corrijas nada.
SOLO verifica.

EJECUTA YA.