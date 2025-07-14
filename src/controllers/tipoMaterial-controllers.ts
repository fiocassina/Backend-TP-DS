// src/controllers/tipoMaterial-controllers.ts
import { Request, Response } from 'express';
import * as service from '../services/tipoMaterial-services.js';



export const getAllTiposMaterial = async (req: Request, res: Response): Promise<void> => {
  try {
    const tipos = await service.getAll(); 
    res.status(200).json(tipos);
  } catch (error) {
    console.error("Error en controller getAllTiposMaterial:", error);
    res.status(500).json({ message: 'Error interno del servidor al obtener tipos de material' });
  }
};

export const getTipoMaterialById = async (req: Request, res: Response): Promise<void> => {
  try {
    const tipos = await service.getById(req.params.id); 
    if (tipos) {
      res.status(200).json(tipos);
    } else {
      res.status(404).json({ message: 'Tipo de material no encontrado' });
    }
  } catch (error) {
    console.error(`Error en controller getTipoMaterialById con ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al obtener tipo de material por ID' });
  }
};

export const createTipoMaterial = async (req: Request, res: Response): Promise<void> => {
  if (!req.body.nombre || !req.body.descripcion) {
    res.status(400).json({ message: 'Nombre y descripción son requeridos' });
    return;
  }
  try {
    const nuevoTipo = await service.create(req.body); 
    res.status(201).json({ message: 'Tipo de material creado', data: nuevoTipo });
  } catch (error) {
    console.error("Error en controller createTipoMaterial:", error);
    if (error instanceof Error && (error as any).code === 11000) {
      res.status(409).json({ message: 'Ya existe un tipo de material con ese nombre. El nombre debe ser único.' });
    } else {
      res.status(500).json({ message: 'Error interno del servidor al crear tipo de material' });
    }
  }
};

export const updateTipoMaterial = async (req: Request, res: Response): Promise<void> => {
  try {
    const tipoActualizado = await service.update(req.params.id, req.body); 
    if (tipoActualizado) {
      res.status(200).json({ message: 'Tipo de material actualizado', data: tipoActualizado });
    } else {
      res.status(404).json({ message: 'Tipo de material no encontrado' });
    }
  } catch (error) {
    console.error(`Error en controller updateTipoMaterial con ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar tipo de material' });
  }
};

export const deleteTipoMaterial = async (req: Request, res: Response): Promise<void> => {
  try {
    const tipoEliminado = await service.remove(req.params.id); 
    if (tipoEliminado) {
      res.status(200).json({ message: 'Tipo de material eliminado', data: tipoEliminado });
    } else {
      res.status(404).json({ message: 'Tipo de material no encontrado' });
    }
  } catch (error) {
    console.error(`Error en controller deleteTipoMaterial con ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar tipo de material' });
  }
};