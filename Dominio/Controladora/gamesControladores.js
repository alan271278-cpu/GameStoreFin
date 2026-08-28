import { Game } from "../Clases/game.js";
import { Memoria } from "../Servicios/memoria.js";

let games = [];
const LaMemoria = new Memoria();

function CargoDatosGames() {
    games = LaMemoria.leer("games") || [];
    InicializarGame();
    ListarGames();
}

function ListarGames() {
    const lista = document.getElementById("lista-games");
    lista.length = 0;

    for (const objGame of games) {
        const texto = `Codigo: ${objGame.codigo} : Nombre: ${objGame.nombre} - Precio: ${objGame.precio} - Stock: ${objGame.stock}`;
        lista.add(new Option(texto, objGame.codigo));
    }
}

function InicializarGame() {
    document.getElementById("codigo").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("codigo").focus();
}

function AgregarGame() {
    const codigo = document.getElementById("codigo").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const precio = Number(document.getElementById("precio").value);
    const stock = Number(document.getElementById("stock").value);

    if (!codigo || !nombre || !descripcion) {
        alert("Debe ingresar todos los campos!");
        return;
    }
    if (!Number.isFinite(precio) || !Number.isFinite(stock) || precio < 0 || stock < 0) {
        alert("Precio y stock deben ser números válidos y no negativos.");
        return;
    }
    if (BuscarGame(codigo)) {
        alert("Ya existe un juego con ese código.");
        return;
    }

    games.push(new Game(codigo, nombre, descripcion, precio, stock));
    LaMemoria.escribir("games", games);
    InicializarGame();
    ListarGames();
    alert("Se agrego el juego correctamente");
}

function SeleccionarGame() {
    const codigoSeleccionado = document.getElementById("lista-games").value;
    const objGame = BuscarGame(codigoSeleccionado);
    if (!objGame) return;

    document.getElementById("codigo").value = objGame.codigo;
    document.getElementById("nombre").value = objGame.nombre;
    document.getElementById("descripcion").value = objGame.descripcion;
    document.getElementById("precio").value = objGame.precio;
    document.getElementById("stock").value = objGame.stock;
}

function ModificarGame() {
    const codigoSeleccionado = document.getElementById("lista-games").value;
    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const precio = Number(document.getElementById("precio").value);
    const stock = Number(document.getElementById("stock").value);

    if (!codigoSeleccionado || !nombre || !descripcion) {
        alert("Debe seleccionar un juego e ingresar todos los campos!");
        return;
    }
    if (!Number.isFinite(precio) || !Number.isFinite(stock) || precio < 0 || stock < 0) {
        alert("Precio y stock deben ser números válidos y no negativos.");
        return;
    }

    const unGame = BuscarGame(codigoSeleccionado);
    if (!unGame) {
        alert("No se encontró el juego seleccionado.");
        return;
    }

    unGame.nombre = nombre;
    unGame.descripcion = descripcion;
    unGame.precio = precio;
    unGame.stock = stock;

    LaMemoria.escribir("games", games);
    InicializarGame();
    ListarGames();
    alert("Se modifico el juego correctamente");
}

function BuscarGame(pCodigo) {
    return games.find((objGame) => objGame.codigo === pCodigo) || null;
}

function EliminarGame() {
    const codigoSeleccionado = document.getElementById("lista-games").value;
    if (!codigoSeleccionado) {
        alert("Debe seleccionar un Juego!");
        return;
    }

    const posicionGame = games.findIndex((objGame) => objGame.codigo === codigoSeleccionado);
    if (posicionGame === -1) {
        alert("No se encontró el juego seleccionado.");
        return;
    }

    games.splice(posicionGame, 1);
    LaMemoria.escribir("games", games);
    InicializarGame();
    ListarGames();
    alert("Se elimino el juego correctamente");
}

// Delegación de eventos: un único listener controla los botones y el select.
document.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-action]");
    if (!boton) return;

    const acciones = { agregar: AgregarGame, modificar: ModificarGame, eliminar: EliminarGame, limpiar: InicializarGame };
    const accion = acciones[boton.dataset.action];
    if (accion) accion();
});

document.addEventListener("change", (evento) => {
    if (evento.target.id === "lista-games") SeleccionarGame();
});

document.addEventListener("DOMContentLoaded", CargoDatosGames);
