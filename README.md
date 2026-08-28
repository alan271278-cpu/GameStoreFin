# GameStoreFin

Aplicación web de gestión de una tienda de videojuegos. El proyecto conserva la funcionalidad original y organiza el código en clases, controladoras y servicios.

## Funcionalidades

- Alta, modificación, consulta y baja de juegos.
- Alta, modificación, consulta y baja de vendedores.
- Registro, modificación y eliminación de ventas.
- Actualización automática del stock.
- Cálculo de cantidades vendidas y ventas por vendedor.
- Estadísticas: total recaudado, juego más vendido, mejor vendedor y juegos con stock.
- Persistencia mediante LocalStorage.

## Requisitos incorporados

- Clases JavaScript con ES6.
- Módulos ES6 mediante `import` y `export`.
- Bootstrap 5 como apoyo para layout y componentes.
- CSS propio para conservar la identidad visual de GameStore.
- Manipulación del DOM.
- Delegación de eventos mediante listeners sobre `document`.
- Validaciones de datos y prevención de entradas inválidas.
- Accesibilidad básica: idioma correcto, etiquetas, `alt`, foco visible y enlace para saltar al contenido.
- Responsive Design mediante CSS y clases responsive de Bootstrap.
- Seguridad básica: los datos se muestran mediante APIs del DOM como `textContent`/`Option` en lugar de interpretar HTML proporcionado por usuarios.
- Mejoras de SEO mediante `title`, `lang` y `meta description`.

## API pública

La consigna contempla el consumo de una API pública mediante Fetch y async/await. Esta versión del proyecto **no incorpora una API pública**, según lo solicitado para esta entrega.

## Estructura

- `Css/` - estilos visuales.
- `Dominio/Clases/` - clases Game, Vendedor y Venta.
- `Dominio/Controladora/` - lógica de cada pantalla.
- `Dominio/Servicios/` - persistencia en LocalStorage.
- `Paginas/` - vistas HTML internas.
- `index.html` - página principal.

## Ejecución

Abrir el proyecto mediante un servidor local para que los módulos ES6 funcionen correctamente. Por ejemplo, con Live Server en Visual Studio Code.

## Publicación

El repositorio puede publicarse con GitHub Pages. La URL final depende del repositorio y de la configuración de GitHub del equipo.

## Decisiones de desarrollo

Se conservaron la paleta, tarjetas, formularios y estilo general del proyecto original. Las modificaciones se limitaron a corregir errores, cumplir requisitos del taller y mejorar accesibilidad, validación y organización del código.
