Actúa como senior full-stack engineer y QA/debugging lead sobre este proyecto. Quiero que trabajes de forma disciplinada, con evidencia, y sin inventar.

## CONTEXTO
En el checkout aparece un error de validación en el campo de vencimiento de tarjeta:

`expiryDate must be in MM/YY format`

Pero en la UI ya se capturó un valor como `12/26` o similar. En la imagen anexa se ve que el flujo queda bloqueado y no permite continuar.

Objetivo:
1. Revisar la causa real del error.
2. Proponer un plan de corrección concreto.
3. Ejecutar la corrección en el código.
4. Validar que el flujo quede funcionando.
5. Entregar un reporte final claro.

## FORMA DE TRABAJAR
Quiero que sigas este orden exacto:

### FASE 1 - DIAGNÓSTICO
Revisa exhaustivamente el flujo de checkout, especialmente:
- componente/página del frontend donde se captura el vencimiento
- estado/formulario del payment method
- máscaras / normalización / sanitización del input
- validación en frontend
- payload que se envía al backend
- DTO / validator / schema / middleware / controller del backend
- modelo de payment method u order si aplica
- integración entre frontend y backend
- tests existentes relacionados con checkout, payment methods, orders, auth y e2e

Debes identificar con evidencia cuál es la causa raíz. Quiero que verifiques al menos estas hipótesis:
- el frontend muestra un valor pero envía otro distinto
- el input elimina o no inserta el `/`
- el estado guarda `1226` en vez de `12/26`
- el backend espera `MM/YY` pero el frontend manda `MMYY`
- hay doble validación inconsistente entre frontend y backend
- existe una transformación previa al submit que rompe el formato
- el campo del input tiene `maxLength`, regex, formatter o parser defectuoso
- el error viene del backend pero se refleja mal en frontend
- la tarjeta de prueba está bien, pero el formato no pasa por una discrepancia de contrato

IMPORTANTE:
- No asumas.
- No modifiques nada todavía en esta fase.
- Primero dame causa raíz con evidencia concreta: archivos, funciones y flujo exacto.
- No rompas nada de lo que ya funciona

Nota para el resultado del diagnóstico:
- Requiero el resultado lo plasmes en el archivo \docs\ResultDiagnosticoCorreccionVencimiento.md, el cual no existe, hay que generarlo. 
- Todo lo que se imprima en terminal debe reflejarse también en dicho archivo. 

### FASE 2 - PLAN DE CORRECCIÓN
Antes de cambiar código, genera un plan breve y preciso que incluya:
- archivos a modificar
- qué se corregirá en frontend
- qué se corregirá en backend
- cómo asegurar compatibilidad del contrato
- qué pruebas se deben correr
- riesgos de romper otros flujos

El plan debe ser mínimo, seguro y orientado a no introducir regresiones.

### FASE 3 - IMPLEMENTACIÓN
Ejecuta la corrección real en código. Requisitos:
- Mantener una única fuente de verdad para el formato del vencimiento.
- El valor aceptado debe ser realmente `MM/YY`.
- Si el usuario captura solo números, el campo debe normalizar correctamente si así conviene.
- El payload final debe llegar al backend exactamente en el formato esperado.
- Si hoy frontend y backend difieren, alinear ambos lados.
- Mejorar el mensaje de error si aplica.
- No romper checkout, reuse de payment methods ni creación de órdenes.

### FASE 4 - VALIDACIÓN
Después de implementar:
- corre los tests relevantes del frontend
- corre los tests relevantes del backend
- si existen tests de checkout/e2e relacionados, ejecútalos también
- si faltan pruebas para cubrir este bug, agrégalas
- valida explícitamente estos casos:

Casos mínimos:
1. `12/26` debe pasar
2. `01/30` debe pasar
3. `1226` debe convertirse correctamente o rechazar con mensaje claro, según la decisión de diseño
4. `1/26` debe fallar si no cumple formato
5. `13/26` debe fallar
6. `00/26` debe fallar
7. valor vacío debe fallar correctamente
8. el submit debe continuar cuando el valor sea válido

### FASE 5 - REPORTE FINAL
Al terminar, entrégame:
1. causa raíz
2. plan aplicado
3. archivos modificados
4. resumen exacto de cambios
5. pruebas ejecutadas y resultados
6. riesgos pendientes o follow-ups

## RESTRICCIONES
- No hagas refactors innecesarios.
- No cambies estilos salvo que sea indispensable para el bug.
- No metas mocks si el flujo actual trabaja contra backend real.
- Si encuentras varias causas, ordénalas por impacto y corrige la principal primero.
- Si hay contradicción entre frontend y backend, documenta el contrato final elegido.

## ENTREGABLE ESPERADO
Quiero que avances de forma autónoma:
1. diagnostica
2. presenta plan
3. ejecuta
4. valida
5. reporta

Si detectas que falta contexto mínimo, dilo de forma puntual y sigue con todo lo demás que sí puedas verificar en el repo.

Toma como referencia la imagen anexa del checkout bloqueado por el mensaje:
`expiryDate must be in MM/YY format`

Nota para el resultado de la ejecución:
- Requiero el resultado lo plasmes en el archivo \docs\ResultEjecucionCorreccionVencimiento.md, el cual no existe, hay que generarlo. 
- Todo lo que se imprima en terminal debe reflejarse también en dicho archivo. 