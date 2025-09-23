import { Request, Response } from "express";
import Entrega from "../model/entrega-model.js";

// Reusa la interfaz que ya tienes o crea una similar
interface RequestWithFile extends Request {
  file?: Express.Multer.File;
  user?: { id: string };
}
interface RequestConUser extends Request {
  user?: { id: string; rol?: string };
}
// Crear una nueva entrega
export const crearEntrega = async (req: RequestWithFile, res: Response) => {
  try {
    const alumnoId = req.user?.id;
    if (!alumnoId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const { proyectoId, comentario } = req.body;
    // Usa req.file.filename si tu Multer usa storage.diskStorage
    const archivoUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const nuevaEntrega = new Entrega({
      proyecto: proyectoId,
      alumno: alumnoId,
      comentario: comentario,
      archivoUrl: archivoUrl,
    });

    await nuevaEntrega.save();
    res.status(201).json({ message: "Entrega creada con éxito", data: nuevaEntrega });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la entrega" });
  }
};

// Obtener todas las entregas para un proyecto específico
export const getEntregasPorProyecto = async (req: Request, res: Response) => {
  try {
    const { proyectoId } = req.params;
    const entregas = await Entrega.find({ proyecto: proyectoId }).populate('alumno', 'nombre email'); // Puedes popular el alumno para obtener sus datos
    res.status(200).json(entregas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las entregas" });
  }
};
export const getEntregasPorAlumno = async (req: RequestConUser, res: Response) => {
  try {
    const alumnoId = req.user?.id;
    if (!alumnoId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }
    const entregas = await Entrega.find({ alumno: alumnoId }).populate('proyecto');
    res.status(200).json(entregas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las entregas del alumno" });
  }
};