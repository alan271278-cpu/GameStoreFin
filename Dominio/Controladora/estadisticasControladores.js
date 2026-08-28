import { Memoria } from "../Servicios/memoria";

function CargoDatosEstadisticas(){
    const LaMemoria = new Memoria();
    ventas = LaMemoria.leer('ventas') || [];
    games = LaMemoria.leer('games') || [];
    vendedores = LaMemoria.leer('vendedores') || [];
    
    TotalRecaudado();
    GameMasVendido();
    MejorVendedor();
    GamesConStock();
}

function TotalRecaudado(){
    let total = 0;
    for (const unaVenta of ventas) {
        total = total + unaVenta.total;
    }
    document.getElementById('totalRecaudado').value = total.toFixed(2);
}

function GamesConStock(){
    let lista = document.getElementById('games-con-stock').options;
    lista.length = 0;

    for (const objGame of games) {
        if(objGame.stock > 0){
            let texto = 'Codigo: ' + objGame.codigo + ' : Nombre: ' + objGame.nombre 
            + ' - Precio: ' + objGame.precio + ' - Stock: ' + objGame.stock;
            let elemento = new Option(texto, objGame.codigo);
            lista.add(elemento);
        }
    }
}

function GameMasVendido(){
    let mayor = 0;
    let objMayor;
    for (const unGame of games) {
        if(unGame.cantVendidos > mayor){
            mayor = unGame.cantVendidos;
            objMayor = unGame;
        }
    }
    if(mayor > 0){
        document.getElementById('masVendido').value = objMayor.nombre 
    + " con " + objMayor.cantVendidos + " unidades";
    }else{
        document.getElementById('masVendido').value = "No hay datos"
    }
    
}

function MejorVendedor(){
    let mayor = 0;
    let objMayor;
    for (const unVendedor of vendedores) {
        if(unVendedor.cantVentas > mayor){
            mayor = unVendedor.cantVentas;
            objMayor = unVendedor;
        }
    }
    document.getElementById('mejorVendedor').value = objMayor
        ? objMayor.nombre + " con " + objMayor.cantVentas + " ventas"
        : "No hay datos";
}