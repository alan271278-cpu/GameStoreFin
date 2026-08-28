import { Vendedor } from "../Clases/vendedor";
import { Memoria } from "../Servicios/memoria";


let vendedores = [];

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

    let unVendedor = new Vendedor(codigo, nombre, cedula);
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
