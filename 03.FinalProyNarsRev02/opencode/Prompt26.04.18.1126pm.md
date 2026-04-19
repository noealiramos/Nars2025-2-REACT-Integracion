Adelante con la implementación del plan propuesto.

Prioridades:
1. separar app de bootstrap (app.js vs server.js)
2. eliminar side effects al importar app
3. asegurar que seed solo corra en bootstrap controlado
4. actualizar tests para usar app en lugar de server.js

Validaciones obligatorias:
- npm test backend completo
- asegurar que las 5 suites de integración que fallaban ahora pasen
- no romper unit tests ni security tests

Documentar todo incluyendo salida completa de terminal.