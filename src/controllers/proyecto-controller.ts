import { Request, Response } from "express";
import * as service from "../services/proyecto-service.js";
import proyectoModel from "../model/proyecto-model.js";

// Extiende el tipo Request para incluir el 'user' de la autenticación
interface RequestConUser extends Request {
  user?: { id: string; rol?: string };
}

// Crear proyecto
export const crearProyecto = async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion, fechaEntrega, claseId, tipoProyecto } = req.body;
    
    // Aquí puedes usar la función del servicio directamente, lo que hace el código más limpio.
    const nuevoProyecto = await service.crearProyecto({
      nombre,
      descripcion,
      fechaEntrega,
      claseId,
      tipoProyectoId: tipoProyecto._id // El servicio espera un string, no un objeto
    });

    res.status(201).json(nuevoProyecto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el proyecto" });
  }
};

// Obtener proyectos de un alumno
export const getProyectosAlumno = async (req: RequestConUser, res: Response) => {
  try {
    const alumnoId = req.user?.id;
    if (!alumnoId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const proyectos = await service.getProyectosPorAlumno(alumnoId);
    res.status(200).json(proyectos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener proyectos", error });
  }
};

// Obtener proyectos de una clase
export const getProyectosPorClase = async (req: Request, res: Response) => {
  const { claseId } = req.params;

  try {
    const proyectos = await proyectoModel.find({ clase: claseId }).populate('tipoProyecto');
    res.status(200).json(proyectos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener proyectos de la clase' });
  }
};

// Eliminar tarea (opcional, pero útil)
/*
export const eliminarProyecto = async (req: RequestConUser, res: Response) => {
  try {
    // Implementa la lógica para eliminar un proyecto
    // Es importante que solo los profesores puedan hacerlo
    // Puedes verificar el rol con req.user?.rol
    const { proyectoId } = req.params;
    const proyectoEliminado = await proyectoModel.findByIdAndDelete(proyectoId);

    if (!proyectoEliminado) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    res.status(200).json({ message: "Proyecto eliminado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el proyecto" });
  }
};*/