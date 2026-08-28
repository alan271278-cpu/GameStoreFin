import { Game } from "../Clases/game";
import { Memoria } from "../Servicios/memoria";

let games = [];

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

    let unGame = new Game(codigo, nombre, descripcion, precio, stock);
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