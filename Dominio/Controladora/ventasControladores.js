import { Venta } from "../Clases/venta";
import { Memoria } from "../Servicios/memoria";

let ventas = [];

function CargoDatosVentas(){
    const LaMemoria = new Memoria();
    ventas = LaMemoria.leer('ventas');
    games = LaMemoria.leer('games');
    vendedores = LaMemoria.leer('vendedores');
    
    if(!ventas){
        ventas = [];
    }
    InicializarVenta();
    CargarVendedores();
    CargarGames();
    ListarVentas();
}

function CargarVendedores(){
    let lista = document.getElementById('codigo-vendedor').options;
    lista.length = 0;

    let elementoBase = new Option("Seleccione un vendedor", "");
    lista.add(elementoBase);

    for (let objVendedor of vendedores) {
        let elemento = new Option(objVendedor.nombre, objVendedor.codigo);
        lista.add(elemento);
    }
}

function CargarGames(){
    let lista = document.getElementById('codigo-game').options;
    lista.length = 0;
                    
    let elementoBase = new Option("Seleccione un game", "");
    lista.add(elementoBase);

    for (let objGame of games) {
        let elemento = new Option(objGame.nombre, objGame.codigo);
        lista.add(elemento);
    }
}

function CargarPrecioGame(){
    document.getElementById('precio-game').value = "";

    let codigoGame = document.getElementById('codigo-game').value;
    for (let objGame of games) {
        if(objGame.codigo == codigoGame){
            document.getElementById('precio-game').value = objGame.precio;
        }
    }
}

function ActualizarStock(pCodigoGame, pCantidad){
    for (const unGame of games) {
        if(unGame.codigo == pCodigoGame){
            unGame.stock = unGame.stock - pCantidad;
        }
    }
}

function DevolverStock(pCodigoGame, pCantidad){
    for (const unGame of games) {
        if(unGame.codigo == pCodigoGame){
            unGame.stock = unGame.stock + pCantidad;
        }
    }
}

function ActualizarCantidadVendidos(pCodigoGame, pCantidad){
    for (const unGame of games) {
        if(unGame.codigo == pCodigoGame){
            unGame.cantVendidos = unGame.cantVendidos + pCantidad;
        }
    }
}

function DevolverCantidadVendidos(pCodigoGame, pCantidad){
    for (const unGame of games) {
        if(unGame.codigo == pCodigoGame){
            unGame.cantVendidos = unGame.cantVendidos - pCantidad;
        }
    }
}

function DevolverCantidadVentas(pCodigoVendedor){
    for (const unVendedor of vendedores) {
        if(unVendedor.codigo == pCodigoVendedor){
            unVendedor.cantVentas -= 1;
        }
    }
}

function ActualizarCantidadVentas(pCodigoVendedor){
    for (const unVendedor of vendedores) {
        if(unVendedor.codigo == pCodigoVendedor){
            unVendedor.cantVentas += 1;
        }
    }
}

function CalculoTotal(){
    let precio = document.getElementById('precio-game').value;
    let cantidad = document.getElementById('cantidad').value;
    let total = 0;
    if(cantidad > 0){
        total = precio * cantidad;
        document.getElementById('total').value = total;
    }
}

function ListarVentas(){
    let lista = document.getElementById('lista-ventas').options;
    lista.length = 0;

    for (let objVenta of ventas) {
        let texto = 'Codigo: ' + objVenta.codigo + ' : Fecha: ' + objVenta.fecha 
        + ' - Game: ' + objVenta.game.nombre + ' - Total: ' + objVenta.total;
        let elemento = new Option(texto, objVenta.codigo);
        lista.add(elemento);
    }
}
function InicializarVenta(){

    let hoy = new Date();
    console.log("HOY", hoy);
    
    let anio = hoy.getFullYear();
    let mes = ""+(hoy.getMonth()+1);
    mes = (mes.length == 1)?"0"+mes:mes;
    let dia = ""+hoy.getDate();
    dia = (dia.length == 1)?"0"+dia:dia;

    let fecha = anio + "-" + mes + "-" + dia;
    console.log("FECHA", fecha);
    
    // Luego de agregarlas al array, limpio las cajas de texto
    document.getElementById("codigo").value = "";
    document.getElementById("fecha").value = fecha;
    document.getElementById("codigo-vendedor").value = "";
    document.getElementById("codigo-game").value = "";
    document.getElementById("precio-game").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("total").value = "";
    // Pongo el foco en la caja de texto nombre
    document.getElementById("codigo").focus();
}

function AgregarVenta(){
    // Leo los datos ingresados de las cajas de texto
    let codigo = document.getElementById("codigo").value;
    let fecha = document.getElementById("fecha").value;
    let codigoVendedor = document.getElementById("codigo-vendedor").value;
    let codigoGame = document.getElementById("codigo-game").value;
    let cantidad = parseInt(document.getElementById("cantidad").value);
    let total = parseInt(document.getElementById("total").value);

    // Debemos agregar validacion para las cajas de texto que no vengan vacías
    if(codigo == "" || fecha == "" || codigoVendedor == "" || codigoGame == ""){
        alert("Debe ingresar todos los campos!");
        return;
    }
    if(isNaN(cantidad) || isNaN(total)){
        alert("Los valores ingresados no son correctos!");
        return;
    }

    let unGame = BuscarGame(codigoGame);
    // validar que el objeto juguete existe
    let unVendedor = BuscarVendedor(codigoVendedor);
    // validar que el objeto vendedor existe
    let unaVenta = new Venta(codigo, fecha, unGame, unVendedor, cantidad, total);
    ventas.push(unaVenta);

    const LaMemoria = new Memoria();
    LaMemoria.escribir('ventas', ventas);

    // Luego de la venta tengo que actualizar el stock del juguete vendido
    // tambien sumarle la cantidad vendida al nuevo atributo
    ActualizarStock(codigoGame, cantidad);
    ActualizarCantidadVendidos(codigoGame, cantidad);
    LaMemoria.escribir('games', games);

    // actualizar cantventas del vendedor y actualizar localStorage del array de vendedores
    ActualizarCantidadVentas(codigoVendedor);
    
    LaMemoria.escribir('vendedores', vendedores);

    InicializarVenta();
    ListarVentas();
    alert("Se agrego la venta correctamente");

}

function SeleccionarVenta(){
    let codigoSeleccionado = document.getElementById('lista-ventas').value;
    
    for (let objVenta of ventas) {
        if(objVenta.codigo == codigoSeleccionado){
            document.getElementById("codigo").value = objVenta.codigo;
            document.getElementById("fecha").value = objVenta.fecha;
            document.getElementById("codigo-vendedor").value = objVenta.vendedor.codigo;
            document.getElementById("codigo-game").value = objVenta.game.codigo;
            CargarPrecioGame();
            document.getElementById("cantidad").value = objVenta.cantidad;
            document.getElementById("total").value = objVenta.total;
        }
    }
}

function ModificarVenta(){
    // Leo el codigo desde la linea seleccionada
    let codigoSeleccionado = document.getElementById("lista-ventas").value;
    // Leo los datos ingresados de las cajas de texto
    let fecha = document.getElementById("fecha").value;
    let codigoVendedor = document.getElementById("codigo-vendedor").value;
    let codigoGame = document.getElementById("codigo-game").value;
    let cantidad = parseInt(document.getElementById("cantidad").value);
    let total = parseInt(document.getElementById("total").value);

    // Debemos agregar validacion para las cajas de texto que no vengan vacías
    if(codigo == "" || fecha == "" || codigoVendedor == "" || codigoGame == ""){
        alert("Debe ingresar todos los campos!");
        return;
    }
    if(isNaN(cantidad) || isNaN(total)){
        alert("Los valores ingresados no son correctos!");
        return;
    }

    let unGame = BuscarGame(codigoGame);
    // validar que el objeto juguete existe
    let unVendedor = BuscarVendedor(codigoVendedor);


    // Cargo el objeto vendedor desde la funcion buscar
    let unVenta = BuscarVenta(codigoSeleccionado);

    unVenta.fecha = fecha;
    unVenta.vendedor = unVendedor;
    unVenta.game = unGame;
    unVenta.cantidad = cantidad;
    unVenta.total = total;

    const LaMemoria = new Memoria();
    LaMemoria.escribir('ventas', ventas);
    
    InicializarVenta();
    ListarVentas();
    alert("Se modifico la venta correctamente");
}

function BuscarVenta(pCodigo){
    for (let objVenta of ventas) {
        if(objVenta.codigo == pCodigo){
            return objVenta;
        }
    }
    return null;
}


function EliminarVenta(){
    // Leo el codigo desde la linea seleccionada
    let codigoSeleccionado = document.getElementById("lista-ventas").value;
    let posicionVenta = -1;

    // Debemos agregar validacion para las cajas de texto que no vengan vacías
    if(codigoSeleccionado == ""){
        alert("Debe seleccionar una Venta!");
        return;
    }

    let unaVenta = BuscarVenta(codigoSeleccionado);

    for (let pos = 0; pos < ventas.length; pos++) {
        if(ventas[pos].codigo == codigoSeleccionado){
            posicionVenta = pos;
        }
    }
    if(posicionVenta != -1){
        ventas.splice(posicionVenta, 1);
    }

    const LaMemoria = new Memoria();
    LaMemoria.escribir('ventas', ventas);

    // Luego de la venta tengo que actualizar el stock del juguete vendido
    // tambien sumarle la cantidad vendida al nuevo atributo
    DevolverStock(unaVenta.game.codigo, unaVenta.cantidad);
    DevolverCantidadVendidos(unaVenta.game.codigo, unaVenta.cantidad);
    LaMemoria.escribir('games', games);

    // actualizar cantventas del vendedor y actualizar localStorage del array de vendedores
    DevolverCantidadVentas(unaVenta.vendedor.codigo);
    LaMemoria.escribir('vendedores', vendedores);

    InicializarVenta();
    ListarVentas();
    alert("Se elimino la venta correctamente");
}