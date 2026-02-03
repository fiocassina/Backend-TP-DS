import { Request, Response } from "express";
import * as correccionService from "../services/correccion-service.js";

export const crearCorreccion = async (req: Request, res: Response) => {
  try {
    const { entrega, nota, comentario } = req.body;
    if (!entrega || nota == null) {
      return res.status(400).json({ message: "Faltan datos obligatorios (entrega y nota)" });
    }

    const nuevaCorreccion = await correccionService.crearCorreccion({ entrega, nota, comentario });
    res.status(201).json({ message: "Corrección creada con éxito", data: nuevaCorreccion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la corrección" });
  }
};

export const getCorreccionesPorEntrega = async (req: Request, res: Response) => {
  try {
    const { entregaId } = req.params;
    const correcciones = await correccionService.getCorreccionesPorEntrega(entregaId);
    res.status(200).json(correcciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las correcciones" });
  }
};

export const getTodasCorrecciones = async (req: Request, res: Response) => {
  try {
    const correcciones = await correccionService.getTodasCorrecciones();
    res.status(200).json(correcciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener todas las correcciones" });
  }
};

export const actualizarCorreccion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 
    const { nota, comentario } = req.body;

    if (nota == null) {
      return res.status(400).json({ message: "Falta la nota para editar" });
    }

    const correccion = await correccionService.actualizarCorreccion(id, { nota, comentario });
    
    res.status(200).json({ message: "Corrección actualizada correctamente", data: correccion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la corrección" });
  }
};

export const eliminarCorreccion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await correccionService.eliminarCorreccion(id);
    
    res.status(200).json({ message: "Corrección eliminada con éxito" });
  } catch (error: any) {
    console.error(error);
    if (error.message === "Corrección no encontrada") {
      return res.status(404).json({ error: "Corrección no encontrada" });
    }
    res.status(500).json({ error: "Error al eliminar la corrección" });
  }
};