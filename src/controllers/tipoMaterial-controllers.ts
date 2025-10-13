import { Request, Response } from 'express';
import * as service from '../services/tipoMaterial-services.js';
import TipoMaterialModel  from '../model/tipoMaterial-model.js';



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