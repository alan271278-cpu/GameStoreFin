export class Game {
    constructor(pCodigo, pNombre, pDescripcion, pPrecio, pStock){
        this.codigo = pCodigo;
        this.nombre = pNombre;
        this.descripcion = pDescripcion;
        this.precio = pPrecio;
        this.stock = pStock;
        this.cantVendidos = 0;
    }
}