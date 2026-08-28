import { Venta } from "../Clases/venta.js";
import { Memoria } from "../Servicios/memoria.js";

let ventas = [];
let games = [];
let vendedores = [];
const LaMemoria = new Memoria();

function CargoDatosVentas() {
    ventas = LaMemoria.leer("ventas") || [];
    games = LaMemoria.leer("games") || [];
    vendedores = LaMemoria.leer("vendedores") || [];
    InicializarVenta();
    CargarVendedores();
    CargarGames();
    ListarVentas();
}

function CargarVendedores() {
    const lista = document.getElementById("codigo-vendedor");
    lista.length = 0;
    lista.add(new Option("Seleccione un vendedor", ""));
    for (const objVendedor of vendedores) lista.add(new Option(objVendedor.nombre, objVendedor.codigo));
}

function CargarGames() {
    const lista = document.getElementById("codigo-game");
    lista.length = 0;
    lista.add(new Option("Seleccione un game", ""));
    for (const objGame of games) lista.add(new Option(objGame.nombre, objGame.codigo));
}

function CargarPrecioGame() {
    const codigoGame = document.getElementById("codigo-game").value;
    const unGame = BuscarGame(codigoGame);
    document.getElementById("precio-game").value = unGame ? unGame.precio : "";
    CalculoTotal();
}

function BuscarGame(codigo) {
    return games.find((objGame) => objGame.codigo === codigo) || null;
}

function BuscarVendedor(codigo) {
    return vendedores.find((objVendedor) => objVendedor.codigo === codigo) || null;
}

function ActualizarStock(codigoGame, cantidad) {
    const unGame = BuscarGame(codigoGame);
    if (unGame) unGame.stock -= cantidad;
}

function DevolverStock(codigoGame, cantidad) {
    const unGame = BuscarGame(codigoGame);
    if (unGame) unGame.stock += cantidad;
}

function ActualizarCantidadVendidos(codigoGame, cantidad) {
    const unGame = BuscarGame(codigoGame);
    if (unGame) unGame.cantVendidos += cantidad;
}

function DevolverCantidadVendidos(codigoGame, cantidad) {
    const unGame = BuscarGame(codigoGame);
    if (unGame) unGame.cantVendidos = Math.max(0, unGame.cantVendidos - cantidad);
}

function ActualizarCantidadVentas(codigoVendedor) {
    const unVendedor = BuscarVendedor(codigoVendedor);
    if (unVendedor) unVendedor.cantVentas += 1;
}

function DevolverCantidadVentas(codigoVendedor) {
    const unVendedor = BuscarVendedor(codigoVendedor);
    if (unVendedor) unVendedor.cantVentas = Math.max(0, unVendedor.cantVentas - 1);
}

function CalculoTotal() {
    const precio = Number(document.getElementById("precio-game").value);
    const cantidad = Number(document.getElementById("cantidad").value);
    document.getElementById("total").value = Number.isFinite(precio) && cantidad > 0 ? (precio * cantidad).toFixed(2) : "";
}

function ListarVentas() {
    const lista = document.getElementById("lista-ventas");
    lista.length = 0;
    for (const objVenta of ventas) {
        const nombreGame = objVenta.game?.nombre || "Game no disponible";
        const texto = `Codigo: ${objVenta.codigo} : Fecha: ${objVenta.fecha} - Game: ${nombreGame} - Total: ${objVenta.total}`;
        lista.add(new Option(texto, objVenta.codigo));
    }
}

function InicializarVenta() {
    const hoy = new Date();
    const fecha = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
    document.getElementById("codigo").value = "";
    document.getElementById("fecha").value = fecha;
    document.getElementById("codigo-vendedor").value = "";
    document.getElementById("codigo-game").value = "";
    document.getElementById("precio-game").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("total").value = "";
    document.getElementById("codigo").focus();
}

function AgregarVenta() {
    const codigo = document.getElementById("codigo").value.trim();
    const fecha = document.getElementById("fecha").value;
    const codigoVendedor = document.getElementById("codigo-vendedor").value;
    const codigoGame = document.getElementById("codigo-game").value;
    const cantidad = Number(document.getElementById("cantidad").value);

    if (!codigo || !fecha || !codigoVendedor || !codigoGame) {
        alert("Debe ingresar todos los campos!");
        return;
    }
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        alert("La cantidad debe ser un número entero mayor que cero.");
        return;
    }
    if (ventas.some((venta) => String(venta.codigo) === codigo)) {
        alert("Ya existe una venta con ese código.");
        return;
    }

    const unGame = BuscarGame(codigoGame);
    const unVendedor = BuscarVendedor(codigoVendedor);
    if (!unGame || !unVendedor) {
        alert("El vendedor o el juego seleccionado no existe.");
        return;
    }
    if (cantidad > Number(unGame.stock)) {
        alert("No hay stock suficiente para realizar la venta.");
        return;
    }

    const total = Number(unGame.precio) * cantidad;
    ventas.push(new Venta(codigo, fecha, unGame, unVendedor, cantidad, total));
    ActualizarStock(codigoGame, cantidad);
    ActualizarCantidadVendidos(codigoGame, cantidad);
    ActualizarCantidadVentas(codigoVendedor);

    LaMemoria.escribir("ventas", ventas);
    LaMemoria.escribir("games", games);
    LaMemoria.escribir("vendedores", vendedores);
    InicializarVenta();
    ListarVentas();
    alert("Se agrego la venta correctamente");
}

function SeleccionarVenta() {
    const codigoSeleccionado = document.getElementById("lista-ventas").value;
    const objVenta = ventas.find((venta) => String(venta.codigo) === codigoSeleccionado);
    if (!objVenta) return;

    document.getElementById("codigo").value = objVenta.codigo;
    document.getElementById("fecha").value = objVenta.fecha;
    document.getElementById("codigo-vendedor").value = objVenta.vendedor?.codigo || "";
    document.getElementById("codigo-game").value = objVenta.game?.codigo || "";
    CargarPrecioGame();
    document.getElementById("cantidad").value = objVenta.cantidad;
    document.getElementById("total").value = objVenta.total;
}

function ModificarVenta() {
    const codigoSeleccionado = document.getElementById("lista-ventas").value;
    const fecha = document.getElementById("fecha").value;
    const codigoVendedor = document.getElementById("codigo-vendedor").value;
    const codigoGame = document.getElementById("codigo-game").value;
    const cantidad = Number(document.getElementById("cantidad").value);

    if (!codigoSeleccionado || !fecha || !codigoVendedor || !codigoGame) {
        alert("Debe seleccionar una venta e ingresar todos los campos!");
        return;
    }
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        alert("La cantidad debe ser un número entero mayor que cero.");
        return;
    }

    const unVenta = ventas.find((venta) => String(venta.codigo) === codigoSeleccionado);
    const unGame = BuscarGame(codigoGame);
    const unVendedor = BuscarVendedor(codigoVendedor);
    if (!unVenta || !unGame || !unVendedor) {
        alert("No se pudo encontrar la venta, el juego o el vendedor.");
        return;
    }

    // Se devuelven los datos de la venta anterior antes de aplicar los nuevos.
    DevolverStock(unVenta.game.codigo, unVenta.cantidad);
    DevolverCantidadVendidos(unVenta.game.codigo, unVenta.cantidad);
    if (unVenta.vendedor?.codigo !== codigoVendedor) {
        DevolverCantidadVentas(unVenta.vendedor?.codigo);
        ActualizarCantidadVentas(codigoVendedor);
    }

    if (cantidad > Number(unGame.stock)) {
        // Restauramos el estado anterior si la nueva cantidad no es válida.
        ActualizarStock(unVenta.game.codigo, unVenta.cantidad);
        ActualizarCantidadVendidos(unVenta.game.codigo, unVenta.cantidad);
        alert("No hay stock suficiente para realizar la modificación.");
        return;
    }

    unVenta.fecha = fecha;
    unVenta.vendedor = unVendedor;
    unVenta.game = unGame;
    unVenta.cantidad = cantidad;
    unVenta.total = Number(unGame.precio) * cantidad;

    ActualizarStock(codigoGame, cantidad);
    ActualizarCantidadVendidos(codigoGame, cantidad);

    LaMemoria.escribir("ventas", ventas);
    LaMemoria.escribir("games", games);
    LaMemoria.escribir("vendedores", vendedores);
    InicializarVenta();
    ListarVentas();
    alert("Se modifico la venta correctamente");
}

function EliminarVenta() {
    const codigoSeleccionado = document.getElementById("lista-ventas").value;
    if (!codigoSeleccionado) {
        alert("Debe seleccionar una Venta!");
        return;
    }

    const posicionVenta = ventas.findIndex((venta) => String(venta.codigo) === codigoSeleccionado);
    if (posicionVenta === -1) {
        alert("No se encontró la venta seleccionada.");
        return;
    }

    const unaVenta = ventas[posicionVenta];
    ventas.splice(posicionVenta, 1);
    DevolverStock(unaVenta.game.codigo, unaVenta.cantidad);
    DevolverCantidadVendidos(unaVenta.game.codigo, unaVenta.cantidad);
    DevolverCantidadVentas(unaVenta.vendedor?.codigo);

    LaMemoria.escribir("ventas", ventas);
    LaMemoria.escribir("games", games);
    LaMemoria.escribir("vendedores", vendedores);
    InicializarVenta();
    ListarVentas();
    alert("Se elimino la venta correctamente");
}

document.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-action]");
    if (!boton) return;
    const acciones = { agregar: AgregarVenta, modificar: ModificarVenta, eliminar: EliminarVenta, limpiar: InicializarVenta };
    const accion = acciones[boton.dataset.action];
    if (accion) accion();
});

document.addEventListener("change", (evento) => {
    if (evento.target.id === "codigo-game") CargarPrecioGame();
    if (evento.target.id === "lista-ventas") SeleccionarVenta();
});

document.addEventListener("blur", (evento) => {
    if (evento.target.id === "cantidad") CalculoTotal();
}, true);

document.addEventListener("DOMContentLoaded", CargoDatosVentas);
