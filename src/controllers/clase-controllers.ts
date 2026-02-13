import { Request, Response } from 'express';
import * as service from '../services/clase-services.js';
import Clase from '../model/clase-model.js';
import proyectoModel from '../model/proyecto-model.js';
import mongoose from 'mongoose';
import { esTextoValido } from '../utils/validaciones.js';
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

  const clasesComoProfe = await Clase.find({ profesorId: userId, archivada: { $ne: true } }).populate('profesorId', 'nombreCompleto');
  const clasesComoAlumno = await Clase.find({ alumnos: userId, archivada: { $ne: true }}).populate('profesorId', 'nombreCompleto');

    res.status(200).json({ clasesComoProfe, clasesComoAlumno });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener clases", error });
  }
};

export const getClasesArchivadas = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    if (!userId) return res.status(401).json({ message: "Usuario no autenticado" });

    const [archivadasComoProfe, archivadasComoAlumno] = await Promise.all([
      Clase.find({ 
        profesorId: userId, 
        archivada: true 
      })
      .populate('profesorId', 'nombreCompleto') 
      .lean(),

      Clase.find({ 
        alumnos: userId, 
        archivada: true 
      })
      .populate('profesorId', 'nombreCompleto') 
      .lean()
    ]);

    res.status(200).json({ 
      clasesComoProfe: archivadasComoProfe, 
      clasesComoAlumno: archivadasComoAlumno 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener clases archivadas' });
  }
};

export const getClaseById = async (req: Request, res: Response) => {
  try {
    const clase = await Clase.findById(req.params.id)
      .populate('profesorId', 'nombreCompleto activo')
      .populate('alumnos', 'nombreCompleto email activo'); 
      
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

export const createClase = async (req: RequestConUser, res: Response): Promise<void> => {
  if (!esTextoValido(req.body.nombre, 3)) {
    res.status(400).json({ message: 'El nombre de la clase debe tener al menos 3 caracteres.' });
    return;
  }
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
    const claseExistente = await Clase.findOne({
      profesorId: userId,
      nombre: { $regex: new RegExp(`^${req.body.nombre.trim()}$`, 'i') } 
    });

    if (claseExistente) {
      res.status(400).json({ 
        message: `Ya tienes una clase creada con el nombre "${req.body.nombre}". Por favor, elige otro nombre.` 
      });
      return; 
    }
    const nuevaClase = await service.create({
      ...req.body,
      profesorId: new mongoose.Types.ObjectId(userId), 
      alumnos: [] 
    });

    res.status(201).json({ message: 'Clase creada', data: nuevaClase });
  } catch (error) {
    console.error("Error en controller createClase:", error);
    res.status(500).json({ message: 'Error interno del servidor al crear clase' });
  }
};

export const updateClase = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.body.nombre && !esTextoValido(req.body.nombre, 3)) {
        res.status(400).json({ message: 'El nombre de la clase debe tener al menos 3 caracteres.' });
        return;
    }
    
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

export const deleteClase = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const clase = await Clase.findByIdAndUpdate(
            id, 
            { archivada: true }, 
            { new: true } 
        );

        if (!clase) {
            return res.status(404).json({ message: 'Clase no encontrada' });
        }

        res.status(200).json({ 
            message: 'Clase archivada correctamente.',
            clase 
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al archivar la clase' });
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

    if (clase.archivada) {
        return res.status(403).json({ 
            mensaje: "No se puede inscribir: La clase está archivada." 
        });
    }

    if (clase.profesorId.toString() === userId) {
      return res.status(403).json({
        mensaje: "No puedes inscribirte a esta clase porque eres el profesor titular."
      });
    }

    const userIdAsObjectId = new mongoose.Types.ObjectId(userId);

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

export const expulsarAlumno = async (req: RequestConUser, res: Response) => {
  try {
    const { id, alumnoId } = req.params;
    const userId = req.user?.id; 

    const clase = await Clase.findById(id);
    if (!clase) return res.status(404).json({ message: 'Clase no encontrada' });

    if (clase.profesorId.toString() !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para expulsar alumnos de esta clase' });
    }

    clase.alumnos = clase.alumnos.filter(a => a.toString() !== alumnoId);
    await clase.save();

    res.status(200).json({ message: 'Alumno eliminado de la clase correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar alumno', error });
  }
};

export const checkSoyAlumno = async (req: RequestConUser, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
        res.json({ esAlumno: false });
        return;
    }

    const cantidad = await Clase.countDocuments({ alumnos: userId });

    res.json({ esAlumno: cantidad > 0 });
  } catch (error) {
    console.error("Error verificando rol de alumno:", error);
    res.status(500).json({ message: "Error al verificar rol" });
  }
};