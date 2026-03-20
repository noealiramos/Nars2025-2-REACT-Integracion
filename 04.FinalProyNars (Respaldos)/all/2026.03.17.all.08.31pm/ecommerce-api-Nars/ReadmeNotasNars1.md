post 
http://localhost:3000/api/auth/register

{
  "displayName": "Admin Ali",
  "email": "aliadmin@shop.com",
  "password": "Admin123",
  "phone": "4491237787",
  "role": "admin",
  "avatar": "https://placehold.co/200x200.png"
}

resultado: 
{
    "displayName": "Admin Ali",
    "email": "aliadmin@shop.com",
    "phone": "4491237787"
}



>>>>>>>

otro usuario a registrar como admin >>>>
{
  "displayName": "Noe Ramos Customer",
  "email": "noe@escorp.com",
  "password": "Admin123",
  "phone": "4491234567",
  "role": "customer",
  "avatar": "https://placehold.co/200x200.png"
}


{OJO
  "currentPassword": "Admin1234",
  "newPassword": "Admin123"
}

{
    "message": "User registered successfully",
    "user": {
        "id": "689ebede836936f1ab187a52",
        "displayName": "Noe Ramos Customer",
        "email": "noe@escorp.com",
        "role": "customer",
        "phone": "4491234567",
        "avatar": "https://placehold.co/200x200.png",
        "active": true,
        "createdAt": "2025-08-15T05:00:14.880Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODllYmVkZTgzNjkzNmYxYWIxODdhNTIiLCJkaXNwbGF5TmFtZSI6IkFkbWluIE5vZSBSYW1vcyIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc1NTIzNDAxNCwiZXhwIjoxNzU1MjM3NjE0fQ.Ze5xdcU2Kn6ZsuMkaModCZlACYoWgQoInV4zzfdQOho"
}

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

{
  "displayName": "Oso Trava",
  "email": "oso@trava.com",
  "password": "Customer123",
  "phone": "4491234567",
  "role": "customer",
  "avatar": "https://placehold.co/200x200.png"
}

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
paymentStatus:
"pending"
"paid"


Status:
body('status').isIn(['pending','processing','shipped','delivered','cancelled']),





>>>>>>>

POST 
http://localhost:3000/api/auth/login
{
  "email": "aliadmin@shop.com",
  "password": "Admin123"
}

respond:
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODk5OGExZWYyODI3MjgzNmM5YzRlMzUiLCJkaXNwbGF5TmFtZSI6IkFkbWluIEFsaSIsInJvbGUiOiJndWVzdCIsImlhdCI6MTc1NDg5MzAyNiwiZXhwIjoxNzU0ODk2NjI2fQ.gdTstSNBq4-7CfBJReZ--Fuu7xM2vJDQ0CyMxaZbN_g"
}

para otro admin >>>>>>>
{
  "displayName": "Admin Nars",
  "email": "Nars@shop.com",
  "password": "Admin123",
  "phone": "4491234567",
  "role": "admin",
  "avatar": "https://placehold.co/200x200.png"
}

resp >>>>
{
    "displayName": "Admin Nars",
    "email": "nars@shop.com",
    "phone": "4491234567"
}

{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODk5OTBjMmYyODI3MjgzNmM5YzRlMzkiLCJkaXNwbGF5TmFtZSI6IkFkbWluIE5hcnMiLCJyb2xlIjoiZ3Vlc3QiLCJpYXQiOjE3NTQ4OTUyNzMsImV4cCI6MTc1NDg5ODg3M30.uFTd-JzDTrBd-h8zJW4DHbNGkmr1C--vop_WNQaTXD"
}



>>>>>>>>>>>>>>>>>>




//respaldo temporal: fb33693d25892c870c0e24837fae4241c24d1b8318a362c2effb63be91eb638c4e988d76eaaef47428df0cb1783566d89cf8692b92ea8f279271fc9834d9dfad



POST 
http://localhost:3000/api/categories
{
  "name": "General",
  "description": "Categoría raíz",
  "imageURL": "https://placehold.co/800x600.png"
}

resp>>>
{
    "name": "General",
    "description": "Categoría raíz",
    "imageURL": "https://placehold.co/800x600.png",
    "parentCategory": null,
    "_id": "6899974ef28272836c9c4e40",
    "__v": 0
}



PUT UPDATE:
http://localhost:3000/api/categories/{{categoryId}}

http://localhost:3000/api/categories/6899974ef28272836c9c4e40 (SIN LOS CORCHETES - hay que pegar el id de la categoria deseada a actualizar)

{
  "name": "General Actualizada",
  "description": "Descripción nueva"
}

response:
{
    "_id": "6899974ef28272836c9c4e40",
    "name": "General",
    "description": "Categoría raíz ACTUALIZADA", (se acualizó la categoria)
    "imageURL": "https://placehold.co/800x600.png",
    "parentCategory": null,
    "__v": 0
}



DELETE 
http://localhost:3000/api/categories/{{categoryId}}

http://localhost:3000/api/categories/68999aa6f28272836c9c4e50 (se elimina la categoria, sólo pegar el id)



GET http://localhost:3000/api/health
