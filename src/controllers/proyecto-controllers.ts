import { Request, Response } from "express";
import * as service from "../services/proyecto-service.js";
import proyectoModel from "../model/proyecto-model.js";

interface RequestConUser extends Request {
  user?: { id: string; rol?: string };
}


export const crearProyecto = async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion, fechaEntrega, claseId, tipoProyecto } = req.body;

    if (!tipoProyecto || !tipoProyecto._id) {
      return res.status(400).json({ error: "Debe enviarse el ID del tipo de proyecto" });
    }

    const nuevoProyecto = await service.crearProyecto({
      nombre,
      descripcion,
      fechaEntrega,
      claseId,
      tipoProyectoId: tipoProyecto._id,
    });

    res.status(201).json(nuevoProyecto);
  } 
  catch (error) 
  {
    console.error("Error al crear el proyecto:", error);
    res.status(500).json({ error: "Error al crear el proyecto" });
  }
};


export const updateProyecto = async (req: Request, res: Response) => {
  try {
    const proyectoActualizado = await service.updateProyecto(req.params.id, req.body);
    if (!proyectoActualizado) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }
    res.status(200).json(proyectoActualizado);
  } catch (error) {
    console.error("Error al actualizar el proyecto:", error);
    res.status(500).json({ error: "Error al actualizar el proyecto" });
  }
};


export const deleteProyecto = async (req: Request, res: Response) => {
  try {
    const proyectoEliminado = await service.deleteProyecto(req.params.id);
    if (!proyectoEliminado) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }
    res.status(200).json({ message: "Proyecto eliminado con éxito" });
  } 
  catch (error) 
  {
    console.error("Error al eliminar el proyecto:", error);
    res.status(500).json({ error: "Error al eliminar el proyecto" });
  }
};


export const getProyectosPorClase = async (req: Request, res: Response) => {
  const { claseId } = req.params;

  try {
    const proyectos = await service.getProyectosPorClase(claseId);
    res.status(200).json(proyectos);
  } 
  catch (error) 
  {
    console.error("Error al obtener proyectos de la clase:", error);
    res.status(500).json({ error: "Error al obtener proyectos de la clase" });
  }
};


export const getProyectosAlumno = async (req: RequestConUser, res: Response) => {
  try {
    const alumnoId = req.user?.id;
    if (!alumnoId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const proyectos = await service.getProyectosPorAlumno(alumnoId);
    res.status(200).json(proyectos);
  } catch (error) {
    console.error("Error al obtener proyectos del alumno:", error);
    res.status(500).json({ message: "Error al obtener proyectos", error });
  }
};
