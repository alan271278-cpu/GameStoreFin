let games = [];
let ventas = [];
let vendedores = [];


//#region Metodos de Ventas
function CargoDatosVentas(){
    const LaMemoria = new Memoria();
    ventas = LaMemoria.leer('ventas') || [];
    games = LaMemoria.leer('games') || [];
    vendedores = LaMemoria.leer('vendedores') || [];
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
    if(codigo.trim() === "" || fecha === "" || codigoVendedor === "" || codigoGame === ""){
        alert("Debe ingresar todos los campos!");
        return;
    }
    if(!Number.isInteger(cantidad) || cantidad <= 0 || !Number.isFinite(total) || total <= 0){
        alert("Los valores ingresados no son correctos!");
        return;
    }

    if(BuscarVenta(codigo)){
        alert("Ya existe una venta con ese código!");
        return;
    }

    let unGame = BuscarGame(codigoGame);
    let unVendedor = BuscarVendedor(codigoVendedor);
    if(!unGame || !unVendedor){
        alert("El vendedor o el juego seleccionado no existe!");
        return;
    }
    if(cantidad > Number(unGame.stock)){
        alert("No hay stock suficiente para realizar la venta!");
        return;
    }

    let unaVenta = new Venta(codigo.trim(), fecha, unGame, unVendedor, cantidad, total);
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
    const codigoSeleccionado = document.getElementById("lista-ventas").value;
    const fecha = document.getElementById("fecha").value;
    const codigoVendedor = document.getElementById("codigo-vendedor").value;
    const codigoGame = document.getElementById("codigo-game").value;
    const cantidad = parseInt(document.getElementById("cantidad").value, 10);
    const total = parseFloat(document.getElementById("total").value);

    if(codigoSeleccionado === "" || fecha === "" || codigoVendedor === "" || codigoGame === ""){
        alert("Debe seleccionar una venta y completar todos los campos!");
        return;
    }
    if(!Number.isInteger(cantidad) || cantidad <= 0 || !Number.isFinite(total) || total <= 0){
        alert("Los valores ingresados no son correctos!");
        return;
    }

    const unVenta = BuscarVenta(codigoSeleccionado);
    const unGame = BuscarGame(codigoGame);
    const unVendedor = BuscarVendedor(codigoVendedor);

    if(!unVenta || !unGame || !unVendedor){
        alert("No se encontró la venta, el vendedor o el juego seleccionado!");
        return;
    }

    // Primero libero los efectos de la venta anterior.
    DevolverStock(unVenta.game.codigo, unVenta.cantidad);
    DevolverCantidadVendidos(unVenta.game.codigo, unVenta.cantidad);
    DevolverCantidadVentas(unVenta.vendedor.codigo);

    if(cantidad > Number(unGame.stock)){
        // Si la nueva venta no entra en stock, restauro el estado anterior.
        ActualizarStock(unVenta.game.codigo, unVenta.cantidad);
        ActualizarCantidadVendidos(unVenta.game.codigo, unVenta.cantidad);
        ActualizarCantidadVentas(unVenta.vendedor.codigo);
        alert("No hay stock suficiente para la nueva cantidad!");
        return;
    }

    unVenta.fecha = fecha;
    unVenta.vendedor = unVendedor;
    unVenta.game = unGame;
    unVenta.cantidad = cantidad;
    unVenta.total = total;

    ActualizarStock(codigoGame, cantidad);
    ActualizarCantidadVendidos(codigoGame, cantidad);
    ActualizarCantidadVentas(codigoVendedor);

    const LaMemoria = new Memoria();
    LaMemoria.escribir('ventas', ventas);
    LaMemoria.escribir('games', games);
    LaMemoria.escribir('vendedores', vendedores);

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
    if(!unaVenta){
        alert("No se encontró la venta seleccionada!");
        return;
    }

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
//#endregion

//#region Metodos de Games

function CargoDatosGames(){
    const LaMemoria = new Memoria();
    games = LaMemoria.leer('games');
    
    if(!games){
        games = [];
    }
    InicializarGame();
    ListarGames();
}

function ListarGames(){
    let lista = document.getElementById('lista-games').options;
    lista.length = 0;

    for (let objGame of games) {
        let texto = 'Codigo: ' + objGame.codigo + ' : Nombre: ' + objGame.nombre 
        + ' - Precio: ' + objGame.precio + ' - Stock: ' + objGame.stock;
        let elemento = new Option(texto, objGame.codigo);
        lista.add(elemento);
    }
}

function InicializarGame(){
    
    // Luego de agregarlas al array, limpio las cajas de texto
    document.getElementById("codigo").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("stock").value = "";
    // Pongo el foco en la caja de texto nombre
    document.getElementById("codigo").focus();
}

function AgregarGame(){
    // Leo los datos ingresados de las cajas de texto
    let codigo = document.getElementById("codigo").value;
    let nombre = document.getElementById("nombre").value;
    let descripcion = document.getElementById("descripcion").value;
    let precio = parseInt(document.getElementById("precio").value);
    let stock = parseInt(document.getElementById("stock").value);

    // Debemos agregar validacion para las cajas de texto que no vengan vacías
    if(codigo == "" || nombre == "" || descripcion == ""){
        alert("Debe ingresar todos los campos!");
        return;
    }
    if(isNaN(precio) || isNaN(stock)){
        alert("Los valores ingresados no son correctos!");
        return;
    }

    if(BuscarGame(codigo)){
        alert("Ya existe un juego con ese código!");
        return;
    }
    if(precio < 0 || stock < 0){
        alert("El precio y el stock no pueden ser negativos!");
        return;
    }

    let unGame = new Game(codigo.trim(), nombre.trim(), descripcion.trim(), precio, stock);
    games.push(unGame);

    const LaMemoria = new Memoria();
    LaMemoria.escribir('games', games);

    InicializarGame();
    ListarGames();
    alert("Se agrego el juego correctamente");

}

function SeleccionarGame(){
    let codigoSeleccionado = document.getElementById('lista-games').value;
    
    for (let objGame of games) {
        if(objGame.codigo == codigoSeleccionado){
            document.getElementById("codigo").value = objGame.codigo;
            document.getElementById("nombre").value = objGame.nombre;
            document.getElementById("descripcion").value = objGame.descripcion;
            document.getElementById("precio").value = objGame.precio;
            document.getElementById("stock").value = objGame.stock;
        }
    }
}

function ModificarGame(){
    // Leo el codigo desde la linea seleccionada
    let codigoSeleccionado = document.getElementById("lista-games").value;
    // Leo los datos ingresados de las cajas de texto
    let nombre = document.getElementById("nombre").value;
    let descripcion = document.getElementById("descripcion").value;
    let precio = parseInt(document.getElementById("precio").value);
    let stock = parseInt(document.getElementById("stock").value);

    // Debemos agregar validacion para las cajas de texto que no vengan vacías
    if(codigoSeleccionado == "" || nombre == "" || descripcion == ""){
        alert("Debe ingresar todos los campos!");
        return;
    }
    if(isNaN(precio) || isNaN(stock)){
        alert("Los valores ingresados no son correctos!");
        return;
    }
    // Cargo el objeto vendedor desde la funcion buscar
    let unGame = BuscarGame(codigoSeleccionado);

    unGame.nombre = nombre;
    unGame.descripcion = descripcion;
    unGame.precio = precio;
    unGame.stock = stock;

    const LaMemoria = new Memoria();
    LaMemoria.escribir('games', games);
    
    InicializarGame();
    ListarGames();
    alert("Se modifico el juego correctamente");
}

function BuscarGame(pCodigo){
    for (let objGame of games) {
        if(objGame.codigo == pCodigo){
            return objGame;
        }
    }
    return null;
}

function EliminarGame(){
    // Leo el codigo desde la linea seleccionada
    let codigoSeleccionado = document.getElementById("lista-games").value;
    let posicionGame = -1;

    // Debemos agregar validacion para las cajas de texto que no vengan vacías
    if(codigoSeleccionado == ""){
        alert("Debe seleccionar un Juego!");
        return;
    }

    for (let pos = 0; pos < games.length; pos++) {
        if(games[pos].codigo == codigoSeleccionado){
            posicionGame = pos;
        }
    }
    if(posicionGame != -1){
        games.splice(posicionGame, 1);
    }

    const LaMemoria = new Memoria();
    LaMemoria.escribir('games', games);

    InicializarGame();
    ListarGames();
    alert("Se elimino el juego correctamente");
}

//#endregion

//#region Metodos de Vendedores

function CargoDatosVendedor(){
    const LaMemoria = new Memoria();
    vendedores = LaMemoria.leer('vendedores');
    
    if(!vendedores){
        vendedores = [];
    }
    InicializarVendedor();
    ListarVendedores();
   
}

function AgregarVendedor(){
    // Leo los datos ingresados de las cajas de texto
    let codigo = document.getElementById("codigo").value;
    let nombre = document.getElementById("nombre").value;
    let cedula = document.getElementById("cedula").value;

    // Debemos agregar validacion para las cajas de texto que no vengan vacías
    if(cedula == "" || nombre == "" || codigo == ""){
        alert("Debe ingresar todos los campos!");
        return;
    }

    if(BuscarVendedor(codigo)){
        alert("Ya existe un vendedor con ese código!");
        return;
    }

    let unVendedor = new Vendedor(codigo.trim(), nombre.trim(), cedula.trim());
    vendedores.push(unVendedor);

    const LaMemoria = new Memoria();
    LaMemoria.escribir('vendedores', vendedores);

    InicializarVendedor();
    ListarVendedores();
    alert("Se agrego el vendedor correctamente");

}

function SeleccionarVendedor(){
    let codigoSeleccionado = document.getElementById('lista-vendedores').value;
    
    for (let objVendedor of vendedores) {
        if(objVendedor.codigo == codigoSeleccionado){
            document.getElementById("codigo").value = objVendedor.codigo;
            document.getElementById("nombre").value = objVendedor.nombre;
            document.getElementById("cedula").value = objVendedor.cedula;
        }
    }
}

function ListarVendedores(){
    let lista = document.getElementById('lista-vendedores').options;
    lista.length = 0;

    for (let objVendedor of vendedores) {
        let texto = 'Codigo: ' + objVendedor.codigo + ' : Nombre: ' + objVendedor.nombre 
        + ' - Cedula: ' + objVendedor.cedula;
        let elemento = new Option(texto, objVendedor.codigo);
        lista.add(elemento);
    }
}
function InicializarVendedor(){
    
    // Luego de agregarlas al array, limpio las cajas de texto
    document.getElementById("codigo").value = "";
    document.getElementById("cedula").value = "";
    document.getElementById("nombre").value = "";
    // Pongo el foco en la caja de texto nombre
    document.getElementById("codigo").focus();
}

function ModificarVendedor(){
    // Leo el codigo desde la linea seleccionada
    let codigoSeleccionado = document.getElementById("lista-vendedores").value;
    // Leo los datos ingresados de las cajas de texto
    let nombre = document.getElementById("nombre").value;
    let cedula = document.getElementById("cedula").value;

    // Debemos agregar validacion para las cajas de texto que no vengan vacías
    if(codigoSeleccionado == "" || nombre == "" || cedula == ""){
        alert("Debe ingresar todos los campos!");
        return;
    }
    // Cargo el objeto vendedor desde la funcion buscar
    let unVendedor = BuscarVendedor(codigoSeleccionado);

    unVendedor.nombre = nombre;
    unVendedor.cedula = cedula;

    const LaMemoria = new Memoria();
    LaMemoria.escribir('vendedores', vendedores);
    
    InicializarVendedor();
    ListarVendedores();
      alert("Se modifico el vendedor correctamete");
  
}

function BuscarVendedor(pCodigo){
    for (let objVendedor of vendedores) {
        if(objVendedor.codigo == pCodigo){
            return objVendedor;
        }
    }
    return null;
}

function EliminarVendedor(){
    // Leo el codigo desde la linea seleccionada
    let codigoSeleccionado = document.getElementById("lista-vendedores").value;
    let posicionVendedor = -1;

    // Debemos agregar validacion para las cajas de texto que no vengan vacías
    if(codigoSeleccionado == ""){
        alert("Debe seleccionar un Vendedor!");
        return;
    }

    for (let pos = 0; pos < vendedores.length; pos++) {
        if(vendedores[pos].codigo == codigoSeleccionado){
            posicionVendedor = pos;
        }
    }
    if(posicionVendedor != -1){
        vendedores.splice(posicionVendedor, 1);
    }

    const LaMemoria = new Memoria();
    LaMemoria.escribir('vendedores', vendedores);

    InicializarVendedor();
    ListarVendedores();
    alert("El vendedor se elimino correctamente");
}

//#endregion

//#region Metodos de Estadísticas

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
//#endregion