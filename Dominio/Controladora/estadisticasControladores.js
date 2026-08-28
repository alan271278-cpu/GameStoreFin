import { Memoria } from "../Servicios/memoria.js";

const LaMemoria = new Memoria();
let ventas = [];
let games = [];
let vendedores = [];

function CargoDatosEstadisticas() {
    ventas = LaMemoria.leer("ventas") || [];
    games = LaMemoria.leer("games") || [];
    vendedores = LaMemoria.leer("vendedores") || [];
    TotalRecaudado();
    GameMasVendido();
    MejorVendedor();
    GamesConStock();
}

function TotalRecaudado() {
    const total = ventas.reduce((acumulado, unaVenta) => acumulado + Number(unaVenta.total || 0), 0);
    document.getElementById("totalRecaudado").value = total.toFixed(2);
}

function GamesConStock() {
    const lista = document.getElementById("games-con-stock");
    lista.length = 0;
    for (const objGame of games) {
        if (Number(objGame.stock) > 0) {
            const texto = `Codigo: ${objGame.codigo} : Nombre: ${objGame.nombre} - Precio: ${objGame.precio} - Stock: ${objGame.stock}`;
            lista.add(new Option(texto, objGame.codigo));
        }
    }
}

function GameMasVendido() {
    const objMayor = games.reduce((mayor, game) => Number(game.cantVendidos || 0) > Number(mayor?.cantVendidos || 0) ? game : mayor, null);
    document.getElementById("masVendido").value = objMayor && Number(objMayor.cantVendidos) > 0
        ? `${objMayor.nombre} con ${objMayor.cantVendidos} unidades`
        : "No hay datos";
}

function MejorVendedor() {
    const objMayor = vendedores.reduce((mayor, vendedor) => Number(vendedor.cantVentas || 0) > Number(mayor?.cantVentas || 0) ? vendedor : mayor, null);
    document.getElementById("mejorVendedor").value = objMayor && Number(objMayor.cantVentas) > 0
        ? `${objMayor.nombre} con ${objMayor.cantVentas} ventas`
        : "No hay datos";
}

document.addEventListener("DOMContentLoaded", CargoDatosEstadisticas);
