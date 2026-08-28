import { Vendedor } from "../Clases/vendedor.js";
import { Memoria } from "../Servicios/memoria.js";

let vendedores = [];
const LaMemoria = new Memoria();

function CargoDatosVendedor() {
    vendedores = LaMemoria.leer("vendedores") || [];
    InicializarVendedor();
    ListarVendedores();
}

function AgregarVendedor() {
    const codigo = document.getElementById("codigo").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const cedula = document.getElementById("cedula").value.trim();

    if (!codigo || !nombre || !cedula) {
        alert("Debe ingresar todos los campos!");
        return;
    }
    if (BuscarVendedor(codigo)) {
        alert("Ya existe un vendedor con ese código.");
        return;
    }

    vendedores.push(new Vendedor(codigo, nombre, cedula));
    LaMemoria.escribir("vendedores", vendedores);
    InicializarVendedor();
    ListarVendedores();
    alert("Se agrego el vendedor correctamente");
}

function SeleccionarVendedor() {
    const codigoSeleccionado = document.getElementById("lista-vendedores").value;
    const objVendedor = BuscarVendedor(codigoSeleccionado);
    if (!objVendedor) return;

    document.getElementById("codigo").value = objVendedor.codigo;
    document.getElementById("nombre").value = objVendedor.nombre;
    document.getElementById("cedula").value = objVendedor.cedula;
}

function ListarVendedores() {
    const lista = document.getElementById("lista-vendedores");
    lista.length = 0;

    for (const objVendedor of vendedores) {
        const texto = `Codigo: ${objVendedor.codigo} : Nombre: ${objVendedor.nombre} - Cedula: ${objVendedor.cedula}`;
        lista.add(new Option(texto, objVendedor.codigo));
    }
}

function InicializarVendedor() {
    document.getElementById("codigo").value = "";
    document.getElementById("cedula").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("codigo").focus();
}

function ModificarVendedor() {
    const codigoSeleccionado = document.getElementById("lista-vendedores").value;
    const nombre = document.getElementById("nombre").value.trim();
    const cedula = document.getElementById("cedula").value.trim();

    if (!codigoSeleccionado || !nombre || !cedula) {
        alert("Debe seleccionar un vendedor e ingresar todos los campos!");
        return;
    }

    const unVendedor = BuscarVendedor(codigoSeleccionado);
    if (!unVendedor) {
        alert("No se encontró el vendedor seleccionado.");
        return;
    }

    unVendedor.nombre = nombre;
    unVendedor.cedula = cedula;
    LaMemoria.escribir("vendedores", vendedores);
    InicializarVendedor();
    ListarVendedores();
    alert("Se modifico el vendedor correctamente");
}

function BuscarVendedor(pCodigo) {
    return vendedores.find((objVendedor) => objVendedor.codigo === pCodigo) || null;
}

function EliminarVendedor() {
    const codigoSeleccionado = document.getElementById("lista-vendedores").value;
    if (!codigoSeleccionado) {
        alert("Debe seleccionar un Vendedor!");
        return;
    }

    const posicionVendedor = vendedores.findIndex((objVendedor) => objVendedor.codigo === codigoSeleccionado);
    if (posicionVendedor === -1) {
        alert("No se encontró el vendedor seleccionado.");
        return;
    }

    vendedores.splice(posicionVendedor, 1);
    LaMemoria.escribir("vendedores", vendedores);
    InicializarVendedor();
    ListarVendedores();
    alert("El vendedor se elimino correctamente");
}

document.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-action]");
    if (!boton) return;

    const acciones = { agregar: AgregarVendedor, modificar: ModificarVendedor, eliminar: EliminarVendedor, limpiar: InicializarVendedor };
    const accion = acciones[boton.dataset.action];
    if (accion) accion();
});

document.addEventListener("change", (evento) => {
    if (evento.target.id === "lista-vendedores") SeleccionarVendedor();
});

document.addEventListener("DOMContentLoaded", CargoDatosVendedor);
