

import { Request, Response, NextFunction } from 'express'
import { TipoMaterial } from '../tipoMaterial.entity.js'
import { TipoMaterialService } from '../services/tipoMaterial.service.js'

const service = new TipoMaterialService()

export function sanitizeTipoMaterialInput(req: Request, res: Response, next: NextFunction) {
    const { nombre } = req.body
    if (typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).json({ message: 'Nombre es requerido' })
    }
    req.body.cleaned = { nombre: nombre.trim() }
    next()
}

export function findAll(req: Request, res: Response) {
    res.json(service.findAll())
}

export function findOne(req: Request, res: Response) {
    const id = parseInt(req.params.id)
    const item = service.findOne(id)
    if (!item) return res.status(404).json({ message: 'No encontrado' })
    res.json(item)
}

export function add(req: Request, res: Response) {
    const { nombre } = req.body.cleaned
    const nuevo = new TipoMaterial(nombre)
    res.status(201).json(service.add(nuevo))
}

export function update(req: Request, res: Response) {
    const id = parseInt(req.params.id)
    const { nombre } = req.body.cleaned
    const actualizado = service.update(id, nombre)
    if (!actualizado) return res.status(404).json({ message: 'No encontrado' })
    res.json(actualizado)
}

export function remove(req: Request, res: Response) {
    const id = parseInt(req.params.id)
    const eliminado = service.delete(id)
    if (!eliminado) return res.status(404).json({ message: 'No encontrado' })
    res.json({ message: 'Eliminado correctamente' })
}

