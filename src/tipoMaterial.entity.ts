
export class TipoMaterial {
    static nextId = 1
    id: number
    nombre: string

    constructor(nombre: string) {
        this.id = TipoMaterial.nextId++
        this.nombre = nombre
    }
}
