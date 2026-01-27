import { Request, Response } from "express";
import mongoose from "mongoose";
import Entrega from "../model/entrega-model.js";
import Proyecto from "../model/proyecto-model.js";
import Clase from "../model/clase-model.js";

interface RequestWithFile extends Request {
  file?: Express.Multer.File;
  user?: { id: string };
}

export const getProyectosPendientesAlumno = async (req: RequestWithFile, res: Response) => {
  try {
    const alumnoId = req.user?.id;
    if (!alumnoId) return res.status(401).json({ message: "Usuario no autenticado" });

    //IDs de las entregas que el alumno ya hizo.
    const entregasAlumno = await Entrega.find({ alumno: alumnoId }).select('proyecto').lean();
    const proyectosEntregadosIds = entregasAlumno.map(e => e.proyecto);

    // IDs de las clases del alumno.
    const clases = await Clase.find({ alumnos: alumnoId }).select('_id').lean();
    const claseIds = clases.map(c => c._id);
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const proyectosPendientes = await Proyecto.find({
      clase: { $in: claseIds },
      _id: { $nin: proyectosEntregadosIds },
      fechaEntrega: { $gte: hoy } 
    })
    .populate({
        path: 'clase',
        select: 'nombre profesorId', 
        populate: {
            path: 'profesorId',    
            select: 'nombreCompleto'        
    }
    })
    .populate('tipoProyecto', 'nombre')
    .sort({ fechaEntrega: 1 }) // Ordenamiento por fecha de entrega
    .lean();

    res.status(200).json(proyectosPendientes);
  } catch (error) {
    console.error("Error al obtener proyectos pendientes:", error);
    res.status(500).json({ error: "Error al obtener proyectos pendientes del alumno" });
  }
};

export const crearEntrega = async (req: RequestWithFile, res: Response) => {
  try {
    const alumnoId = req.user?.id;
    if (!alumnoId) return res.status(401).json({ message: "Usuario no autenticado" });

    const { proyectoId, comentario } = req.body;
    if (!proyectoId) return res.status(400).json({ message: "Falta proyectoId" });

    // Verificar si ya existe una entrega para este alumno y proyecto
    const entregaExistente = await Entrega.findOne({ alumno: alumnoId, proyecto: proyectoId });
    if (entregaExistente) {
      return res.status(400).json({ message: "Ya has entregado este proyecto" });
    }

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
      .populate('alumno', 'nombreCompleto email')
      .populate('proyecto', '_id nombre fechaEntrega tipoProyecto');

    if (!entregaConPopulates) {
      return res.status(500).json({ error: "Error al recuperar la entrega creada" });
    }

    const entregaConEstado = { ...entregaConPopulates.toObject(), estado: entregaConPopulates.estado || 'pendiente' };

    res.status(201).json({ message: "Entrega creada con éxito", data: entregaConEstado });
  } catch (error) {
    console.error("Error al crear entrega:", error);
    res.status(500).json({ error: "Error al crear la entrega" });
  }
};

export const getEntregasPorProyecto = async (req: Request, res: Response) => {
  try {
    const { proyectoId } = req.params;
    if (!proyectoId) return res.status(400).json({ message: "Falta el ID del proyecto" });
    if (!mongoose.Types.ObjectId.isValid(proyectoId)) {
      console.warn('[entregas] proyectoId inválido:', proyectoId);
      return res.status(400).json({ message: "ID de proyecto inválido" });
    }

    const entregas = await Entrega.find({ proyecto: proyectoId })
      .populate('alumno', 'nombreCompleto email')
      .populate('proyecto', '_id nombre fechaEntrega tipoProyecto')
      .populate('correccion') 
      .lean();

    const entregasConEstado = entregas.map(e => ({ ...e, estado: e.estado || 'pendiente' }));

    if (req.query.wrap === 'true') return res.status(200).json({ data: entregasConEstado });

    return res.status(200).json(entregasConEstado);
  } catch (error) {
    console.error("Error al obtener entregas por proyecto:", error);
    res.status(500).json({ error: "Error al obtener las entregas" });
  }
};

export const getEntregasPorAlumno = async (req: RequestWithFile, res: Response) => {
  try {
    const alumnoId = req.user?.id;
    if (!alumnoId) return res.status(401).json({ message: "Usuario no autenticado" });

    const entregas = await Entrega.find({ alumno: alumnoId })
      .populate('proyecto', '_id nombre fechaEntrega tipoProyecto')
      .populate('correccion') 
      .lean();

    const entregasConEstado = entregas.map(e => ({ ...e, estado: e.estado || 'pendiente' }));

    res.status(200).json(entregasConEstado);
  } catch (error) {
    console.error("Error al obtener entregas por alumno:", error);
    res.status(500).json({ error: "Error al obtener las entregas del alumno" });
  }
};

export const getEntregaPorId = async (req: Request, res: Response) => {
  try {
    const { entregaId } = req.params;
    if (!entregaId) return res.status(400).json({ message: "Falta el ID de la entrega" });
    if (!mongoose.Types.ObjectId.isValid(entregaId)) {
      return res.status(400).json({ message: "ID de entrega inválido" });
    }

    const entrega = await Entrega.findById(entregaId)
      .populate('alumno', 'nombreCompleto email')
      .populate('proyecto', '_id nombre fechaEntrega tipoProyecto')
      .populate('correccion'); 

    if (!entrega) return res.status(404).json({ message: "Entrega no encontrada" });

    const entregaConEstado = { ...entrega.toObject(), estado: entrega.estado || 'pendiente' };

    res.status(200).json(entregaConEstado);
  } catch (error) {
    console.error("Error al obtener entrega por ID:", error);
    res.status(500).json({ error: "Error al obtener la entrega" });
  }
};

export const getReporteAprobadas = async (req: Request, res: Response) => {
  const { proyectoId } = req.query;

  if (!proyectoId || typeof proyectoId !== 'string' || !mongoose.Types.ObjectId.isValid(proyectoId)) {
    return res.status(400).json({ msg: 'Falta o es inválido el parámetro: proyectoId es obligatorio.' });
  }

  try {
    const criteriosBusqueda = {
      proyecto: proyectoId,
      estado: 'aprobada',
    };

    const entregasAprobadas = await Entrega.find(criteriosBusqueda)
      .select('fechaEntrega correccion proyecto alumno')
      .populate({
        path: 'alumno',
        select: 'nombreCompleto'
      })
      .populate({
        path: 'proyecto',
        select: 'nombre'
      })
      .populate('correccion')
      .sort({ fechaEntrega: -1 });

    const reporteData = entregasAprobadas.map((entrega: any) => ({
      id: entrega._id,
      proyectoNombre: entrega.proyecto.nombre,
      alumnoNombre: entrega.alumno.nombreCompleto,
      nota: entrega.correccion ? entrega.correccion.nota : null,
      fechaEntrega: entrega.fechaEntrega,
      fechaCorreccion: entrega.correccion ? entrega.correccion.fechaCorreccion : null,
      comentarioCorreccion: entrega.correccion ? entrega.correccion.comentario : null,

    }));

    res.status(200).json(reporteData);

  } catch (error) {
    console.error('Error al generar el reporte de entregas:', error);
    res.status(500).json({
      msg: 'Error interno del servidor. Error al buscar entregas aprobadas.'
    });
  }
};