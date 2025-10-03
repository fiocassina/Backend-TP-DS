// controllers/entrega-controllers.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import Entrega from "../model/entrega-model.js";

// Extiende Request para Multer y usuario autenticado
interface RequestWithFile extends Request {
  file?: Express.Multer.File;
  user?: { id: string };
}

// Crear una nueva entrega
export const crearEntrega = async (req: RequestWithFile, res: Response) => {
  try {
    console.log('[entregas] crearEntrega - body:', req.body, 'file:', !!req.file);
    const alumnoId = req.user?.id;
    if (!alumnoId) return res.status(401).json({ message: "Usuario no autenticado" });

    const { proyectoId, comentario } = req.body;
    if (!proyectoId) return res.status(400).json({ message: "Falta proyectoId" });

    const archivoUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const nuevaEntrega = new Entrega({
      proyecto: proyectoId,
      alumno: alumnoId,
      comentario,
      archivoUrl,
      fechaEntrega: new Date()
    });

    await nuevaEntrega.save();

    const entregaConPopulates = await Entrega.findById(nuevaEntrega._id)
      .populate('alumno', 'nombre apellido email')
      .populate('proyecto', 'nombre fechaEntrega tipoProyecto');

    res.status(201).json({ message: "Entrega creada con éxito", data: entregaConPopulates });
  } catch (error) {
    console.error("Error al crear entrega:", error);
    res.status(500).json({ error: "Error al crear la entrega" });
  }
};

// Obtener entregas de un proyecto
export const getEntregasPorProyecto = async (req: Request, res: Response) => {
  try {
    const { proyectoId } = req.params;
    console.log('[entregas] getEntregasPorProyecto - params:', req.params);

    if (!proyectoId) return res.status(400).json({ message: "Falta el ID del proyecto" });
    if (!mongoose.Types.ObjectId.isValid(proyectoId)) {
      console.warn('[entregas] proyectoId inválido:', proyectoId);
      return res.status(400).json({ message: "ID de proyecto inválido" });
    }

    const entregas = await Entrega.find({ proyecto: proyectoId })
      .populate('alumno', 'nombre apellido email')
      .populate('proyecto', 'nombre fechaEntrega tipoProyecto')
      .lean();

    console.log(`[entregas] encontrados: ${entregas.length} entregas para proyecto ${proyectoId}`);

    // Si el frontend espera { data: [...] } podés usar ?wrap=true
    if (req.query.wrap === 'true') return res.status(200).json({ data: entregas });

    return res.status(200).json(entregas);
  } catch (error) {
    console.error("Error al obtener entregas por proyecto:", error);
    res.status(500).json({ error: "Error al obtener las entregas" });
  }
};

// Obtener todas las entregas de un alumno autenticado
export const getEntregasPorAlumno = async (req: RequestWithFile, res: Response) => {
  try {
    const alumnoId = req.user?.id;
    if (!alumnoId) return res.status(401).json({ message: "Usuario no autenticado" });

    const entregas = await Entrega.find({ alumno: alumnoId })
      .populate('proyecto', 'nombre fechaEntrega tipoProyecto')
      .lean();

    res.status(200).json(entregas);
  } catch (error) {
    console.error("Error al obtener entregas por alumno:", error);
    res.status(500).json({ error: "Error al obtener las entregas del alumno" });
  }
};

// Obtener detalle de una entrega específica
export const getEntregaPorId = async (req: Request, res: Response) => {
  try {
    const { entregaId } = req.params;
    if (!entregaId) return res.status(400).json({ message: "Falta el ID de la entrega" });
    if (!mongoose.Types.ObjectId.isValid(entregaId)) {
      return res.status(400).json({ message: "ID de entrega inválido" });
    }

    const entrega = await Entrega.findById(entregaId)
      .populate('alumno', 'nombre apellido email')
      .populate('proyecto', 'nombre fechaEntrega tipoProyecto');

    if (!entrega) return res.status(404).json({ message: "Entrega no encontrada" });

    res.status(200).json(entrega);
  } catch (error) {
    console.error("Error al obtener entrega por ID:", error);
    res.status(500).json({ error: "Error al obtener la entrega" });
  }
};
