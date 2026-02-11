import { Request, Response } from "express";
import * as service from "../services/proyecto-service.js";
import proyectoModel from "../model/proyecto-model.js";
import { esFechaFutura, esTextoValido } from '../utils/validaciones.js';
import entregaModel from "../model/entrega-model.js";
interface RequestConUser extends Request {
  user?: { id: string; rol?: string };
}


export const crearProyecto = async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion, fechaEntrega, claseId, tipoProyecto } = req.body;

    if (!tipoProyecto || !tipoProyecto._id) {
      return res.status(400).json({ error: "Debe enviarse el ID del tipo de proyecto" });
    }
    if (!esTextoValido(nombre, 3, 50)) {
        return res.status(400).json({ error: "El nombre debe tener entre 3 y 50 caracteres." });
    }
    if (!esTextoValido(descripcion, 5, 200)) {
        return res.status(400).json({ error: "La descripción debe tener entre 5 y 200 caracteres." });
    }
    const fechaObj = new Date(fechaEntrega);


    if (!esFechaFutura(fechaObj)) {
        return res.status(400).json({ error: "La fecha de entrega no puede ser en el pasado." });
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
    const { nombre, descripcion, fechaEntrega } = req.body;

    if (nombre !== undefined && !esTextoValido(nombre, 3, 50)) {
        return res.status(400).json({ error: "El nombre debe tener entre 3 y 50 caracteres." });
    }
    
    if (descripcion !== undefined && !esTextoValido(descripcion, 5, 200)) {
        return res.status(400).json({ error: "La descripción debe tener entre 5 y 200 caracteres." });
    }

    if (fechaEntrega) {
        const fechaObj = new Date(fechaEntrega);
        if (isNaN(fechaObj.getTime()) || !esFechaFutura(fechaObj)) {
            return res.status(400).json({ error: "La nueva fecha de entrega debe ser válida y futura." });
        }
    }

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
    const { id } = req.params;
    const entregasAsociadas = await entregaModel.countDocuments({ proyecto: id });
    if (entregasAsociadas > 0) { //si el proyecto tiene entregas, lo cancelamos
      const proyectoCancelado = await proyectoModel.findByIdAndUpdate(
        id,
        { estado: 'cancelado' },
        { new: true } 
      );

      if (!proyectoCancelado) {
        return res.status(404).json({ message: "Proyecto no encontrado." });
      }

      return res.status(200).json({
        mensaje: 'El proyecto tiene entregas. Se marcó como CANCELADO.',
        tipo: 'CANCELADO',
        proyecto: proyectoCancelado 
      });

    } else { // si el proyecto no tiene entregas, se elimina permanentemente
      const proyectoEliminado = await proyectoModel.findByIdAndDelete(id);

      if (!proyectoEliminado) {
        return res.status(404).json({ message: "Proyecto no encontrado." });
      }

      return res.status(200).json({
        mensaje: 'El proyecto no tenía entregas. Se eliminó permanentemente.',
        tipo: 'ELIMINADO'
      });
    }

  } catch (error) {
    console.error("Error al eliminar el proyecto:", error);
    return res.status(500).json({ error: "Error interno al procesar la solicitud." });
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

export const getProyectoById = async (req: Request, res: Response) => {
  try {
    const proyecto = await service.getProyectoById(req.params.id);
    if (!proyecto) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }
    res.status(200).json(proyecto);
  } catch (error) {
    console.error("Error al obtener proyecto:", error);
    res.status(500).json({ error: "Error al obtener proyecto" });
  }
};
