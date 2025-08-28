import { Request, Response } from 'express';
import * as service from '../services/clase-services.js';



export const getAllClases = async (req: Request, res: Response): Promise<void> => {
  try {
    const clases = await service.getAll(); 
    res.status(200).json(clases);
  } catch (error) {
    console.error("Error en controller getAllClases:", error);
    res.status(500).json({ message: 'Error interno del servidor al obtener clases' });
  }
};

export const getClaseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const clases = await service.getById(req.params.id); 
    if (clases) {
      res.status(200).json(clases);
    } else {
      res.status(404).json({ message: 'Clase no encontrada' });
    }
  } catch (error) {
    console.error(`Error en controller getClaseById con ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al obtener clase por ID' });
  }
};

export const getClaseByClave = async (req: Request, res: Response): Promise<void> => {
  const { clave } = req.query;

    if (!clave || typeof clave !== 'string') {
        res.status(400).json({ message: 'La clave de la clase es requerida' });
        return;
    }

    try {
        const clase = await service.getByClave(clave);
        if (clase) {
            res.status(200).json(clase);
        } else {
            res.status(404).json({ message: 'No se encontró ninguna clase con esa clave' });
        }
    } catch (error) {
        console.error("Error en controller getClaseByClave:", error);
        res.status(500).json({ message: 'Error interno del servidor al buscar clase' });
    }
};

export const createClase = async (req: Request, res: Response): Promise<void> => {
  if (!req.body.nombre || !req.body.materia) {
    res.status(400).json({ message: 'Nombre y materia son requeridos' });
    return;
  }
  try {
    const nuevaClase = await service.create(req.body); 
    res.status(201).json({ message: 'Clase creada', data: nuevaClase });
  } catch (error) {
    console.error("Error en controller createClase:", error);
    res.status(500).json({ message: 'Error interno del servidor al crear clase' });
    }
  };


export const updateClase = async (req: Request, res: Response): Promise<void> => {
  try {
    const claseActualizada = await service.update(req.params.id, req.body); 
    if (claseActualizada) {
      res.status(200).json({ message: 'Clase actualizada', data: claseActualizada });
    } else {
      res.status(404).json({ message: ' Clase no encontrada' });
    }
  } catch (error) {
    console.error(`Error en controller updateClase con ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar clase' });
  }
};

export const deleteClase = async (req: Request, res: Response): Promise<void> => {
  try {
    const claseEliminada = await service.remove(req.params.id); 
    if (claseEliminada) {
      res.status(200).json({ message: 'Clase eliminada', data: claseEliminada });
    } else {
      res.status(404).json({ message: 'Clase no encontrada' });
    }
  } catch (error) {
    console.error(`Error en controller deleteClase con ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar clase' });
  }
};