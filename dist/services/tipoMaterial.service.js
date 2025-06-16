export class TipoMaterialService {
    constructor() {
        this.items = [];
    }
    findAll() {
        return this.items;
    }
    findOne(id) {
        return this.items.find((item) => item.id === id);
    }
    add(material) {
        this.items.push(material);
        return material;
    }
    update(id, nombre) {
        const item = this.findOne(id);
        if (!item)
            return undefined;
        item.nombre = nombre;
        return item;
    }
    delete(id) {
        const index = this.items.findIndex((item) => item.id === id);
        if (index === -1)
            return undefined;
        const [deleted] = this.items.splice(index, 1);
        return deleted;
    }
}
//# sourceMappingURL=tipoMaterial.service.js.map