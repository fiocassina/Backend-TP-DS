import Proyecto, { IProyecto } from "../model/proyecto-model.js";
import Clase from "../model/clase-model.js";
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


  const nuevoProyecto = new Proyecto({
    nombre: data.nombre,
    descripcion: data.descripcion,
    clase: new mongoose.Types.ObjectId(data.claseId),
    tipoProyecto: {
      _id: new mongoose.Types.ObjectId(data.tipoProyectoId),
      nombre: data.tipoProyectoId,
      descripcion: '' 
    },
    fechaEntrega: data.fechaEntrega,
  });

  return await nuevoProyecto.save();
};

export const getProyectosPorAlumno = async (alumnoId: string): Promise<IProyecto[]> => {
  const clasesDelAlumno = await Clase.find({ alumnos: new mongoose.Types.ObjectId(alumnoId) }).select('_id');
  const idsDeClases = clasesDelAlumno.map(clase => clase._id);

  const proyectos = await Proyecto.find({ clase: { $in: idsDeClases } })
    .populate("clase tipoProyecto");

  return proyectos;
};

export const getProyectoById = async (proyectoId: string): Promise<IProyecto | null> => {
  return await Proyecto.findById(proyectoId).populate("clase tipoProyecto");
};