// src/controllers/material-controllers.ts
import { Request, Response } from 'express';
import * as service from '../services/material-services.js';

export const getAllMateriales = async (req: Request, res: Response): Promise<void> => {
  try {
    const materiales = await service.getAll();
    res.status(200).json(materiales);
  } catch (error) {
    console.error('Error en controller getAllMateriales:', error);
    res.status(500).json({ message: 'Error interno al obtener materiales' });
  }
};

export const getMaterialById = async (req: Request, res: Response): Promise<void> => {
  try {
    const material = await service.getById(req.params.id);
    if (material) {
      res.status(200).json(material);
    } else {
      res.status(404).json({ message: 'Material no encontrado' });
    }
  } catch (error) {
    console.error(`Error en controller getMaterialById con ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno al obtener material por ID' });
  }
};

export const getMaterialesPorClase = async (req: Request, res: Response): Promise<void> => {
  try {
    const { claseId } = req.params;
    const materiales = await service.getByClase(claseId);
    res.status(200).json(materiales);
  } catch (error) {
    console.error(`Error en controller getMaterialesPorClase con claseId ${req.params.claseId}:`, error);
    res.status(500).json({ message: 'Error interno al obtener materiales por clase' });
  }
};

export const createMaterial = async (req: Request, res: Response): Promise<void> => {
  const { nombre, tipoId, claseId } = req.body;
  if (!nombre || !tipoId || !claseId) {
    res.status(400).json({ message: 'Nombre, tipo y clase son requeridos' });
    return;
  }

  try {
    const nuevoMaterial = await service.create(req.body);
    res.status(201).json({ message: 'Material creado', data: nuevoMaterial });
  } catch (error) {
    console.error('Error en controller createMaterial:', error);
    res.status(500).json({ message: 'Error interno al crear material' });
  }
};

export const updateMaterial = async (req: Request, res: Response): Promise<void> => {
  try {
    const materialActualizado = await service.update(req.params.id, req.body);
    if (materialActualizado) {
      res.status(200).json({ message: 'Material actualizado', data: materialActualizado });
    } else {
      res.status(404).json({ message: 'Material no encontrado' });
    }
  } catch (error) {
    console.error(`Error en controller updateMaterial con ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno al actualizar material' });
  }
};

export const deleteMaterial = async (req: Request, res: Response): Promise<void> => {
  try {
    const materialEliminado = await service.remove(req.params.id);
    if (materialEliminado) {
      res.status(200).json({ message: 'Material eliminado', data: materialEliminado });
    } else {
      res.status(404).json({ message: 'Material no encontrado' });
    }
  } catch (error) {
    console.error(`Error en controller deleteMaterial con ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno al eliminar material' });
  }
};
