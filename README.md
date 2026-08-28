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
- Obtención de la temperatura actual mediante una API pública.
- Visualización de la fecha actual.

## Requisitos incorporados

- Clases JavaScript con ES6.
- Módulos ES6 mediante import y export.
- Bootstrap 5 como apoyo para layout y componentes.
- CSS propio para conservar la identidad visual de GameStore.
- Manipulación del DOM.
- Delegación de eventos mediante listeners sobre document.
- Validaciones de datos y prevención de entradas inválidas.
- Accesibilidad básica: idioma correcto, etiquetas, alt, foco visible y enlace para saltar al contenido.
- Responsive Design mediante CSS y clases responsive de Bootstrap.
- Seguridad básica: los datos se muestran mediante APIs del DOM como textContent/Option en lugar de interpretar HTML proporcionado por usuarios.
- Mejoras de SEO mediante title, lang y meta description.
- Consumo de una API pública mediante fetch.
- Uso de funciones asíncronas mediante async/await.
- Manejo de errores en la consulta de la API.

## API pública

El proyecto incorpora el consumo de una API pública para obtener información meteorológica.

La consulta se realiza mediante fetch y funciones asíncronas utilizando async/await.

La información obtenida se utiliza para mostrar la temperatura actual en la página principal.

También se incorpora un manejo de errores mediante try/catch para mostrar un mensaje alternativo cuando no es posible obtener la información de la API.

## Estructura

- Css/ - estilos visuales.
- Dominio/Clases/ - clases Game, Vendedor y Venta.
- Dominio/Controladora/ - lógica de cada pantalla.
- Dominio/Servicios/ - persistencia en LocalStorage y servicio de clima.
- Paginas/ - vistas HTML internas.
- index.html - página principal.

## Ejecución

Abrir el proyecto mediante un servidor local para que los módulos ES6 funcionen correctamente. Por ejemplo, con Live Server en Visual Studio Code.

## Publicación

El repositorio puede publicarse con GitHub Pages. La URL final depende del repositorio y de la configuración de GitHub del equipo.

## Decisiones de desarrollo

Se conservaron la paleta, tarjetas, formularios y estilo general del proyecto original. Las modificaciones se limitaron a corregir errores, cumplir requisitos del taller y mejorar accesibilidad, validación y organización del código.

Además, se incorporó el servicio de clima utilizando una API pública, fetch y async/await, junto con la visualización de la fecha actual en la página principal