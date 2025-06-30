import { Request, Response } from 'express';
import * as service from '../services/tipoMaterial-services.js'; 


export const getAllTiposMaterial = (req: Request, res: Response): void => {
  const tipos = service.getAll();
  res.status(200).json({ data: tipos });
};


export const getTipoMaterialById = (req: Request, res: Response): void => {
  const tipo = service.getById(Number(req.params.id));
  if (tipo) {
    res.status(200).json({ data: tipo });
  } else {
    res.status(404).json({ message: 'Tipo de material no encontrado' });
  }
};


export const createTipoMaterial = (req: Request, res: Response): void => {
  if (!req.body.nombre || !req.body.descripcion) {
    res.status(400).json({ message: 'Nombre y descripción son requeridos' });
    return;
  }
  const nuevoTipo = service.create(req.body);
  res.status(201).json({ message: 'Tipo de material creado', data: nuevoTipo });
};


export const updateTipoMaterial = (req: Request, res: Response): void => {
  const tipoActualizado = service.update(Number(req.params.id), req.body);
  if (tipoActualizado) {
    res.status(200).json({ message: 'Tipo de material actualizado', data: tipoActualizado });
  } else {
    res.status(404).json({ message: 'Tipo de material no encontrado' });
  }
};


export const deleteTipoMaterial = (req: Request, res: Response): void => {
  const tipoEliminado = service.remove(Number(req.params.id));
  if (tipoEliminado) {
    res.status(200).json({ message: 'Tipo de material eliminado', data: tipoEliminado });
  } else {
    res.status(404).json({ message: 'Tipo de material no encontrado' });
  }
};
