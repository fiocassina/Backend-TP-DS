import { Request, Response } from 'express';
import * as service from '../services/clase-services.js';
import Clase from '../model/clase-model.js';
import mongoose from 'mongoose';

interface RequestConUser extends Request {
  user?: { id: string };
}


export const getMisClases = async (req: RequestConUser, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ mensaje: "Usuario no autenticado" });
      return;
    }

    // Clases como profesor
    const clasesComoProfe = await Clase.find({ profesorId: userId });

    // Clases como alumno
    const clasesComoAlumno = await Clase.find({ alumnos: userId }).populate('profesorId', 'nombreCompleto');  //el populate funciona como si hicieramos un "JOIN" en SQL, es p mostrar nombre y apellido del profe

    res.status(200).json({ clasesComoProfe, clasesComoAlumno });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener clases", error });
  }
};

export const getClaseById = async (req: Request, res: Response) => {
  try {
    const clase = await Clase.findById(req.params.id).populate('profesorId', 'nombreCompleto');
    if (clase) {
      res.status(200).json(clase);
    } else {
      res.status(404).json({ message: 'Clase no encontrada' });
    }
  } catch (error) {
    console.error(`Error en controller getClaseById con ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al obtener clase por ID' });
  }
};

export const inscribirAlumno = async (req: RequestConUser, res: Response) => {
  try {
    const userId = req.user?.id;
    const { clave } = req.body;

    if (!userId) {
      res.status(401).json({ mensaje: "Usuario no autenticado" });
      return;
    }

    if (!clave) {
      res.status(400).json({ mensaje: "Se requiere la clave de la clase" });
      return;
    }

    const clase = await Clase.findOne({ clave: clave });
    if (!clase) {
      res.status(404).json({ mensaje: "Clase no encontrada" });
      return;
    }

    const userIdAsObjectId = new mongoose.Types.ObjectId(userId);

    // Verificar si el alumno ya está inscrito
    if (clase.alumnos.includes(userIdAsObjectId)) {
      res.status(400).json({ mensaje: "Ya estás inscrito en esta clase" });
      return;
    }

    clase.alumnos.push(userIdAsObjectId);
    await clase.save();

    res.status(200).json({ mensaje: "Inscripción exitosa", clase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al inscribir alumno", error });
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
export const createClase = async (req: RequestConUser, res: Response): Promise<void> => {
  if (!req.body.nombre || !req.body.materia) {
    res.status(400).json({ message: 'Nombre y materia son requeridos' });
    return;
  }

  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ message: 'Usuario no autenticado' });
    return;
  }

  try {


    const nuevaClase = await service.create({
      ...req.body,
      profesorId: new mongoose.Types.ObjectId(userId) 
    });

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
      const clasePopulada = await Clase.findById(claseActualizada._id).populate('profesorId', 'nombreCompleto');

      res.status(200).json({ message: 'Clase actualizada', data: clasePopulada });
    } else {
      res.status(404).json({ message: 'Clase no encontrada' });
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
