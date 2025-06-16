

import { TipoMaterial } from '../tipoMaterial.entity.js'

export class TipoMaterialService {
    private items: TipoMaterial[] = []

    findAll(): TipoMaterial[] {
        return this.items
    }

    findOne(id: number): TipoMaterial | undefined {
        return this.items.find((item) => item.id === id)
    }

    add(material: TipoMaterial): TipoMaterial {
        this.items.push(material)
        return material
    }

    update(id: number, nombre: string): TipoMaterial | undefined {
        const item = this.findOne(id)
        if (!item) return undefined
        item.nombre = nombre
        return item
    }

    delete(id: number): TipoMaterial | undefined {
        const index = this.items.findIndex((item) => item.id === id)
        if (index === -1) return undefined
        const [deleted] = this.items.splice(index, 1)
        return deleted
    }
}
