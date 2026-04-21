Antes de implementar:

Confirma si el contenedor padre del hero usa:
- grid con múltiples columnas (grid-cols-2, md:grid-cols-2)
- flex con justify-between
- o si existe una segunda columna (aunque esté vacía)

Si existe cualquiera de estos:
1. Ajusta el layout a una sola columna (grid-cols-1)
   o
2. Haz que el bloque de texto ocupe col-span-full

Después de eso, aplica el ajuste de eliminar max-width.

Quiero asegurar que el problema no sea doble (layout + max-width).
No implementar hasta confirmar esto.