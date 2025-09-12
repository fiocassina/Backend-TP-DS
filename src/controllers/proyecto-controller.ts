import { Request, Response } from "express";
import proyectoModel from "../model/proyecto-model.js";
import * as service from "../services/proyecto-service.js";

interface RequestConUser extends Request {
  user?: { id: string };
}

// Crear proyecto
export const crearProyecto = async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion, fechaEntrega, claseId, tipoProyecto } = req.body;
    
    if (!tipoProyecto?._id || !tipoProyecto.nombre) {
      return res.status(400).json({ error: "Debe enviar el objeto completo de tipoProyecto" });
    }

    const nuevoProyecto = new proyectoModel({
      nombre,
      descripcion,
      clase: claseId,
      tipoProyecto,
      fechaEntrega
    });

    await nuevoProyecto.save();
    res.status(201).json(nuevoProyecto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el proyecto" });
  }
};

// Entregar tarea
export const entregarTarea = async (req: RequestConUser, res: Response) => {
  try {
    const alumnoId = req.user?.id;
    const { proyectoId, archivoUrl } = req.body;
    if (!alumnoId) return res.status(401).json({ message: "Usuario no autenticado" });

    const proyectoActualizado = await service.entregarTarea(proyectoId, alumnoId, archivoUrl);
    res.status(200).json({ message: "Tarea entregada", data: proyectoActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al entregar tarea", error });
  }
};

// Obtener proyectos de un alumno
export const getProyectosAlumno = async (req: RequestConUser, res: Response) => {
  try {
    const alumnoId = req.user?.id;
    if (!alumnoId) return res.status(401).json({ message: "Usuario no autenticado" });

    const proyectos = await service.getProyectosPorAlumno(alumnoId);
    res.status(200).json(proyectos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener proyectos", error });
  }
};
export const getProyectosPorClase = async (req: Request, res: Response) => {
  const { claseId } = req.params;
  console.log("Clase ID recibida:", claseId);

  try {
    const proyectos = await proyectoModel.find({ clase: claseId }).populate('tipoProyecto');
    console.log("Proyectos encontrados:", proyectos);
    res.status(200).json(proyectos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener proyectos de la clase' });
  }
};
