import Proyecto, { IProyecto } from "../model/proyecto-model.js";
import Clase from "../model/clase-model.js";
import TipoProyecto from "../model/tipoProyecto-model.js";
import mongoose from "mongoose";

interface ProyectoInput {
  nombre: string;
  descripcion?: string;
  claseId: string;
  tipoProyectoId: string;
  fechaEntrega: Date;
}


export const crearProyecto = async (data: ProyectoInput): Promise<IProyecto> => {
  const clase = await Clase.findById(data.claseId);
  if (!clase) {
    throw new Error("Clase no encontrada");
  }

  const tipoProyecto = await TipoProyecto.findById(data.tipoProyectoId);
  if (!tipoProyecto) {
    throw new Error("Tipo de proyecto no encontrado");
  }

  const nuevoProyecto = new Proyecto({
    nombre: data.nombre,
    descripcion: data.descripcion,
    clase: new mongoose.Types.ObjectId(data.claseId),
    tipoProyecto: new mongoose.Types.ObjectId(data.tipoProyectoId), 
    fechaEntrega: data.fechaEntrega,
  });

  return await nuevoProyecto.save();
};

export const updateProyecto = async (proyectoId: string, data: Partial<ProyectoInput>): Promise<IProyecto | null> => {
  return await Proyecto.findByIdAndUpdate(proyectoId, data, { new: true });
};

export const deleteProyecto = async (proyectoId: string): Promise<IProyecto | null> => {
  return await Proyecto.findByIdAndDelete(proyectoId);
};

export const getProyectoById = async (proyectoId: string): Promise<IProyecto | null> => {
  return await Proyecto.findById(proyectoId)
    .populate("clase")
    .populate("tipoProyecto");
};

export const getProyectosPorClase = async (claseId: string): Promise<IProyecto[]> => {
  const proyectos = await Proyecto.find({ clase: claseId })
    .populate("tipoProyecto")
    .populate("clase");

  return proyectos;
};


export const getProyectosPorAlumno = async (alumnoId: string): Promise<IProyecto[]> => {
  const clasesDelAlumno = await Clase.find({ alumnos: new mongoose.Types.ObjectId(alumnoId) }).select("_id");
  const idsDeClases = clasesDelAlumno.map((clase) => clase._id);

  const proyectos = await Proyecto.find({ clase: { $in: idsDeClases } })
    .populate("clase")
    .populate("tipoProyecto");

  return proyectos;
};



