# Reflexiones — Sprint 1 (Pokedex Minimalista)

## 1) Dependencias: ¿Por qué useEffect tiene []?
Porque con [] el efecto se ejecuta solo una vez al montar.
- Sin array: se ejecuta en cada render.
- Con [pokemons]: cada cambio de pokemons dispara el effect y como adentro hago setPokemons, se crea un loop infinito.

## 2) ¿Por qué no ponemos fetch directo en el cuerpo del componente?
Porque el componente se ejecuta en cada render. Eso causaría múltiples peticiones y posibles loops.

## 3) Orden de ejecución correcto
1. Primer render (pokemons = [])
2. Corre useEffect
3. Inicia fetch
4. Responde el servidor
5. setPokemons actualiza estado
6. React re-renderiza y muestra la lista

## 4) ¿Para qué response.json()?
Convierte el body de la respuesta a un objeto JS. Devuelve una promesa con los datos ya parseados.

## 5) ¿Por qué no usar index como key?
Porque si la lista cambia de orden o se filtra, el index cambia y React puede reciclar elementos incorrectamente.
El name es estable y único.
