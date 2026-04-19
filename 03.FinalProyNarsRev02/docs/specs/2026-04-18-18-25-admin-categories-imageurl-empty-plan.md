# 2026-04-18 18:25 - Admin Categories imageURL empty plan

## 1. Diagnostico

### Frontend

- En `ecommerce-app-Nars/src/pages/AdminCategoriesPage.jsx` el estado inicial del formulario ya permite vacio real:
  - `imageURL: ""` en `EMPTY_FORM`.
- El input usa `value={form.imageURL}` y `handleFieldChange` solo copia el valor tecleado; no hay placeholder tecnico ni fallback visual forzado en el input.
- En `handleEdit(...)`, el formulario carga `imageURL: category.imageURL || ""`.
  - Esto significa que si la categoria ya trae una URL placeholder persistida, el input la vuelve a mostrar al editar.
- En `handleSubmit(...)`, el payload manda:

```text
imageURL: form.imageURL.trim() || undefined
```

- Eso implica:
  - si el usuario deja el campo vacio, frontend NO manda cadena vacia;
  - manda `undefined`.
- No se detecto en frontend una logica tipo `|| placehold.co`, `?? placehold.co` o `.trim() || placeholder` para categorias.

### Backend

- En `ecommerce-api-Nars/src/models/category.js`, el schema define:

```text
imageURL: {
  type: String,
  trim: true,
  default: 'https://placehold.co/800x600.png'
}
```

- En `ecommerce-api-Nars/src/controllers/categoryController.js`:
  - `createCategory(...)` usa `imageURL: imageURL || null`
  - `updateCategory(...)` usa directamente `{ name, description, parentCategory, imageURL }`
- En `ecommerce-api-Nars/src/routes/categoryRoutes.js`, `imageURL` es opcional pero si viene presente debe ser URL valida.

### Comportamiento tecnico inferido

- Creacion nueva con campo vacio:
  - frontend manda `undefined`;
  - controller lo convierte a `null` con `imageURL || null`;
  - Mongoose, al recibir `null`, no necesariamente usa el default del schema; pero si el campo se omite o queda `undefined`, el default puede reaparecer.
- Edicion con categoria ya persistida con placeholder:
  - `handleEdit(...)` mete la URL existente al form;
  - si el usuario la borra y frontend manda `undefined`, el update puede no limpiar realmente el campo o dejarlo indefinido, dependiendo del comportamiento de Mongoose en `findByIdAndUpdate`;
  - si luego se vuelve a leer desde BD/API y el valor persistido sigue siendo placeholder, reaparece en el input.

## 2. Evidencia tecnica

### Hallazgos en frontend

```text
Found 35 matches
... AdminCategoriesPage.jsx:
  Line 13:   imageURL: "",
  Line 20:   if (form.imageURL && !/^https?:\/\//i.test(form.imageURL.trim())) return "La imagen debe ser una URL válida.";
  Line 51:       imageURL: category.imageURL || "",
  Line 87:       imageURL: form.imageURL.trim() || undefined,
  Line 122:           <TextInput id="admin-category-image" name="imageURL" label="Imagen (URL)" value={form.imageURL} onChange={handleFieldChange} />
```

### Hallazgos en backend

```text
Found 11 matches
... categoryRoutes.js:
  Line 25:   body('imageURL').optional({ values: 'null' }).isURL().withMessage('imageURL must be a valid URL').trim(),
... categoryController.js:
  Line 60:     const { name, description, parentCategory, imageURL } = req.body;
  Line 65:       imageURL: imageURL || null,
  Line 75:     const { name, description, parentCategory, imageURL } = req.body;
  Line 80:       { name, description, parentCategory, imageURL },
... category.js:
  Line 17:     default: 'https://placehold.co/800x600.png',
```

### Conteo real en DB

Comando:

```text
node -e "const mongoose=require('mongoose'); (async()=>{await mongoose.connect('mongodb://localhost:27017/ecommerce-db-jewelry'); const docs=await mongoose.connection.db.collection('categories').find({}, {projection:{name:1,imageURL:1}}).toArray(); const placeholders=docs.filter(d=>typeof d.imageURL==='string' && d.imageURL.includes('placehold.co')); console.log('total_categories=' + docs.length); console.log('with_placeholder=' + placeholders.length); console.log(JSON.stringify(placeholders.slice(0,10), null, 2)); await mongoose.disconnect();})().catch(err=>{console.error(err); process.exit(1);});"
```

Salida:

```text
total_categories=13
with_placeholder=12
[
  {
    "_id": "68a572b9a1f69c1bbfa577a9",
    "name": "Anillos",
    "imageURL": "https://placehold.co.Anillos/800x600.png"
  },
  {
    "_id": "68a57412a1f69c1bbfa577b1",
    "name": "Pulseras",
    "imageURL": "https://placehold.co.Pulseras/800x600.png"
  },
  {
    "_id": "68a57428a1f69c1bbfa577b3",
    "name": "Aretes",
    "imageURL": "https://placehold.co.Aretes/800x600.png"
  },
  {
    "_id": "68a6b6715aceec4975c87e88",
    "name": "Collares",
    "imageURL": "https://placehold.co.Collares/800x600.png"
  },
  {
    "_id": "68a6b6a15aceec4975c87e8a",
    "name": "Dijes",
    "imageURL": "https://placehold.co.Dijes/800x600.png"
  },
  {
    "_id": "68a6b6bc5aceec4975c87e8c",
    "name": "Broqueles",
    "imageURL": "https://placehold.co.Broqueles/800x600.png"
  },
  {
    "_id": "68a6b6db5aceec4975c87e8e",
    "name": "Charm Bracelets (Pulseras para charms)",
    "imageURL": "https://placehold.co.Charms/800x600.png"
  },
  {
    "_id": "68a6b8215aceec4975c87e90",
    "name": "Empaques personalizados",
    "imageURL": "https://placehold.co.EmpaquesPersonalizados/800x600.png"
  },
  {
    "_id": "68a6b8415aceec4975c87e92",
    "name": "Tobilleras",
    "imageURL": "https://placehold.co.Tobilleras/800x600.png"
  },
  {
    "_id": "68a6b86a5aceec4975c87e94",
    "name": "Charms sueltos",
    "imageURL": "https://placehold.co.ChamrsIndividuales/800x600.png"
  }
]
```

### Verificacion via API

Comando:

```text
node -e "fetch('http://localhost:3001/api/categories?limit=100&sort=name&order=asc').then(r=>r.json()).then(body=>{const categories=Array.isArray(body.categories)?body.categories:[]; const placeholders=categories.filter(c=>typeof c.imageURL==='string' && c.imageURL.includes('placehold.co')); console.log('api_categories=' + categories.length); console.log('api_with_placeholder=' + placeholders.length); console.log(JSON.stringify(placeholders.slice(0,10), null, 2));}).catch(err=>{console.error(err); process.exit(1);});"
```

Salida:

```text
api_categories=13
api_with_placeholder=12
[
  {
    "_id": "68a572b9a1f69c1bbfa577a9",
    "name": "Anillos",
    "description": "Aros para dedos en diseños lisos, ajustables o con incrustaciones. Disponibles en plata, oro, acero o latón; opciones de grabado, tallas estándar y anillos de promesa/compromiso.",
    "imageURL": "https://placehold.co.Anillos/800x600.png",
    "parentCategory": null,
    "__v": 0
  },
  {
    "_id": "68a57428a1f69c1bbfa577b3",
    "name": "Aretes",
    "description": "Pendientes para perforación tipo poste, aro, gancho o ear cuff. Diseños desde básicos hasta statement; materiales hipoalergénicos disponibles.",
    "imageURL": "https://placehold.co.Aretes/800x600.png",
    "parentCategory": null,
    "__v": 0
  },
  {
    "_id": "68a6b6bc5aceec4975c87e8c",
    "name": "Broqueles",
    "description": "Aretes pequeños de poste para uso diario (tuerca mariposa o de rosca). Recomendados para piel sensible, bebés y adultos; en acero quirúrgico, plata u oro.",
    "imageURL": "https://placehold.co.Broqueles/800x600.png",
    "parentCategory": null,
    "__v": 0
  },
  {
    "_id": "68a6b6db5aceec4975c87e8e",
    "name": "Charm Bracelets (Pulseras para charms)",
    "description": "Pulseras modulares diseñadas para añadir charms. Sistemas de rosca/clip y topes de seguridad; perfectas para coleccionar temáticas.",
    "imageURL": "https://placehold.co.Charms/800x600.png",
    "parentCategory": null,
    "__v": 0
  },
  {
    "_id": "68a6b86a5aceec4975c87e94",
    "name": "Charms sueltos",
    "description": "Charms individuales para pulseras o cadenas. Venta por pieza para crear combinaciones; compatibles con “charm bracelets” y dijes.",
    "imageURL": "https://placehold.co.ChamrsIndividuales/800x600.png",
    "parentCategory": null,
    "__v": 0
  },
  {
    "_id": "68a6b6715aceec4975c87e88",
    "name": "Collares",
    "description": "Cadenas y colgantes para el cuello, desde choker hasta largos. Compatibles con dijes intercambiables y diferentes calibres de cadena.",
    "imageURL": "https://placehold.co.Collares/800x600.png",
    "parentCategory": null,
    "__v": 0
  },
  {
    "_id": "68a6b6a15aceec4975c87e8a",
    "name": "Dijes",
    "description": "Colgantes individuales para cadenas o pulseras. Motivos de iniciales, símbolos y piedras; ideales para personalizar y crear combinaciones.",
    "imageURL": "https://placehold.co.Dijes/800x600.png",
    "parentCategory": null,
    "__v": 0
  },
  {
    "_id": "68a6b8215aceec4975c87e90",
    "name": "Empaques personalizados",
    "description": "Cajas, bolsas y tarjetas con logotipo y colores de la marca. Opciones premium para regalo en kraft, cartón rígido o terciopelo.",
    "imageURL": "https://placehold.co.EmpaquesPersonalizados/800x600.png",
    "parentCategory": null,
    "__v": 0
  },
  {
    "_id": "68a57412a1f69c1bbfa577b1",
    "name": "Pulseras",
    "description": "Piezas para la muñeca en cadena, rígidas o con eslabones. Materiales: plata, oro, acero, cuero; opción de grabado o incorporación de charms.",
    "imageURL": "https://placehold.co.Pulseras/800x600.png",
    "parentCategory": null,
    "__v": 0
  },
  {
    "_id": "69d056663b8b66e629061573",
    "name": "QA Test Category",
    "description": "Categoria semilla para pruebas E2E automatizadas",
    "imageURL": "https://placehold.co/800x600.png",
    "parentCategory": null,
    "__v": 0
  }
]
```

### Detalle puntual de una categoria

Comando:

```text
node -e "fetch('http://localhost:3001/api/categories/68a572b9a1f69c1bbfa577a9').then(r=>r.json().then(j=>({status:r.status,body:j}))).then(({status,body})=>{console.log('status=' + status); console.log(JSON.stringify({name:body.name,imageURL:body.imageURL}, null, 2));}).catch(err=>{console.error(err); process.exit(1);});"
```

Salida:

```text
status=200
{
  "name": "Anillos",
  "imageURL": "https://placehold.co.Anillos/800x600.png"
}
```

### Verificacion de null o vacio en DB

Primer intento con error de sintaxis:

```text
[eval]:1
const mongoose=require('mongoose'); (async()=>{await mongoose.connect('mongodb://localhost:27017/ecommerce-db-jewelry'); const docs=await mongoose.connection.db.collection('categories').find({imageURL: {: [null, '']}}).project({name:1,imageURL:1}).toArray(); console.log('categories_with_null_or_empty=' + docs.length); console.log(JSON.stringify(docs,null,2)); await mongoose.disconnect();})().catch(err=>{console.error(err); process.exit(1);});
                                                                                                                                                                                                           ^

SyntaxError: Unexpected token ':'
Node.js v22.15.0
```

Segundo intento correcto:

```text
categories_with_null_or_empty=0
[]
```

## 3. Causa raiz

La causa raiz es principalmente de persistencia backend/datos, con participacion secundaria del flujo frontend.

### Capa principal afectada

- Backend/modelo + datos persistidos.

### Explicacion exacta

1. El schema de categorias define un default placeholder en `imageURL`.
2. La mayoria de categorias ya tienen una URL placeholder persistida en MongoDB/API.
3. Cuando se edita una categoria, frontend toma `category.imageURL || ""` y vuelve a cargar ese valor persistido en el input.
4. Al intentar vaciar el campo, frontend manda `undefined` (`form.imageURL.trim() || undefined`), no una instruccion explicita para limpiar el valor.
5. En update, backend recibe `imageURL` posiblemente `undefined` y hace `findByIdAndUpdate(..., { imageURL })`; eso no representa de forma clara una limpieza a `null` o `""`.
6. Como el valor placeholder ya estaba guardado o no se limpia de forma explicita, reaparece al recargar/editar.

Conclusión:

- El placeholder no nace en el input visual del frontend.
- El placeholder si nace en backend/modelo y ya esta mayormente persistido en BD.
- El frontend contribuye al problema porque, al dejar vacio, envia `undefined` en vez de una intencion explicita de borrar el dato.

## 4. Plan de correccion

### Objetivo del cambio

- Permitir que `Imagen (URL)` pueda quedar realmente vacio.
- Evitar que se reponga placeholder automaticamente.
- Mantener crear/editar sin romper categorias existentes.

### Archivos probables a modificar

- `ecommerce-app-Nars/src/pages/AdminCategoriesPage.jsx`
- `ecommerce-api-Nars/src/controllers/categoryController.js`
- `ecommerce-api-Nars/src/models/category.js`
- potencialmente tests de categorias frontend/backend si existen o si se agregan minimos.

### Cambios concretos propuestos

1. Frontend:
   - dejar de mandar `undefined` cuando el campo se vacia;
   - mandar una intencion explicita, por ejemplo `null` o `""`, segun lo que se acuerde para el contrato.
2. Backend controller:
   - normalizar `imageURL` para que `""` se convierta explicitamente a `null` al crear/editar.
   - en update, no dejar `imageURL` ambiguo como `undefined` si el usuario quiere limpiar el campo.
3. Modelo Category:
   - quitar el `default: 'https://placehold.co/800x600.png'` de `imageURL`, o al menos dejar de forzarlo para nuevas categorias.
4. Datos existentes:
   - no hace falta migrar de inmediato para no elevar riesgo, pero si se quiere limpiar UX real en categorias actuales, convendria un script/migracion controlada para reemplazar placeholders heredados por `null` donde aplique.

### Validaciones posteriores necesarias

- Crear categoria nueva con `imageURL` vacio.
- Editar categoria existente con placeholder y dejarla vacia.
- Guardar y recargar, verificando que permanezca vacia.
- Confirmar que una categoria con URL real sigue guardando correctamente.
- Verificar que otros modulos no dependan de `category.imageURL` con valor obligatorio.

## 5. Riesgos

- Riesgo bajo a medio si se limita a categorias.
- El mayor riesgo es de compatibilidad con categorias existentes que ya guardan placeholders, no del formulario en si.
- Quitar el default del schema puede cambiar el comportamiento de futuras creaciones, pero eso parece deseado en este caso.
- Si existe algun consumo futuro de `category.imageURL` que asuma string no vacio, habria que tolerar `null` o `""`; en la auditoria actual no se detecto una vista util que dependa de mostrar esa imagen.

## 6. Checklist final

- ¿El placeholder nace en frontend?
  - No como fuente principal.
- ¿El placeholder nace en backend?
  - Si. El schema tiene default y la persistencia actual ya contiene placeholders.
- ¿Ya está persistido en BD?
  - Si. `12` de `13` categorias auditadas lo tienen.
- ¿Permitir vacío rompe algo?
  - No parece romper nada relevante en la auditoria actual; el riesgo es bajo si se maneja `null`/`""` correctamente.
- ¿Hay impacto en tests?
  - Si. Haran falta tests de crear/editar categoria con `imageURL` vacio.
- ¿Hay impacto en otros módulos?
  - No se detecto impacto visible importante, pero debe verificarse cualquier consumidor futuro de `category.imageURL`.
- ¿Recomiendas quitar el placeholder por completo o solo dejar de forzarlo?
  - Recomiendo ambas cosas: dejar de forzarlo en nuevas operaciones y quitar el default del modelo. La limpieza de datos existentes puede hacerse aparte o en la misma correccion si se quiere UX completamente consistente.

## 7. Estado

Plan listo. No se ejecutó ningún cambio.
