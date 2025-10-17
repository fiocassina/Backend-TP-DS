import { Request, Response } from "express";
import * as correccionService from "../services/correccion-service.js";

export const crearCorreccion = async (req: Request, res: Response) => {
  try {
    const { entrega, nota, comentario } = req.body;
    if (!entrega || nota == null || !comentario) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
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
