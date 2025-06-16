export class TipoMaterial {
    constructor(nombre) {
        this.id = TipoMaterial.nextId++;
        this.nombre = nombre;
    }
}
TipoMaterial.nextId = 1;
//# sourceMappingURL=tipoMaterial.entity.js.map