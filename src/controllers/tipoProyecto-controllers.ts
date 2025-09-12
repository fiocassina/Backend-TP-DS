import { Request, Response } from 'express';
import * as service from '../services/tipoProyecto-services.js';


export const getAllTiposProyecto = async (req: Request, res: Response): Promise<void> => {
  try {
    const tipos = await service.getAll(); 
    console.log("Tipos de proyecto desde backend:", tipos);
    res.status(200).json(tipos);
  } catch (error) {
    console.error("Error en controller getAllTiposProyecto:", error);
    res.status(500).json({ message: 'Error interno del servidor al obtener tipos de proyecto' });
  }
};

export const getTipoProyectoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const tipos = await service.getById(req.params.id); 
    if (tipos) {
      res.status(200).json(tipos);
    } else {
      res.status(404).json({ message: 'Tipo de proyecto no encontrado' });
    }
  } catch (error) {
    console.error(`Error en controller getTipoProyectoById con ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al obtener tipo de proyecto por ID' });
  }
};

export const createTipoProyecto = async (req: Request, res: Response): Promise<void> => {
  if (!req.body.nombre || !req.body.descripcion) {
    res.status(400).json({ message: 'Nombre y descripción son requeridos' });
    return;
  }
  try {
    const nuevoTipo = await service.create(req.body); 
    res.status(201).json({ message: 'Tipo de proyecto creado', data: nuevoTipo });
  } catch (error) {
    console.error("Error en controller createTipoProyecto:", error);
    if (error instanceof Error && (error as any).code === 11000) {
      res.status(409).json({ message: 'Ya existe un tipo de proyecto con ese nombre. El nombre debe ser único.' });
    } else {
      res.status(500).json({ message: 'Error interno del servidor al crear tipo de proyecto' });
    }
  }
};

export const updateTipoProyecto = async (req: Request, res: Response): Promise<void> => {
  try {
    const tipoActualizado = await service.update(req.params.id, req.body); 
    if (tipoActualizado) {
      res.status(200).json({ message: 'Tipo de proyecto actualizado', data: tipoActualizado });
    } else {
      res.status(404).json({ message: 'Tipo de proyecto no encontrado' });
    }
  } catch (error) {
    console.error(`Error en controller updateTipoProyecto con ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar tipo de proyecto' });
  }
};

export const deleteTipoProyecto = async (req: Request, res: Response): Promise<void> => {
  try {
    const tipoEliminado = await service.remove(req.params.id); 
    if (tipoEliminado) {
      res.status(200).json({ message: 'Tipo de proyecto eliminado', data: tipoEliminado });
    } else {
      res.status(404).json({ message: 'Tipo de proyecto no encontrado' });
    }
  } catch (error) {
    console.error(`Error en controller deleteTipoProyecto con ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar tipo de proyecto' });
  }
};