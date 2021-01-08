export class Persona {
    id: string;
    nombre: string;
    apellido: string;
    fnac: Date;
    direccion: string;
    telefono: string;
    pais: string;

    constructor() {
        this.id = "";
        this.nombre = "";
        this.apellido = "";
        this.fnac = new Date();
        this.direccion = "";
        this.telefono = "";
        this.pais = "";
    }
}