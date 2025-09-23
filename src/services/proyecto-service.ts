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

  // La lógica de inicializar entregas ya no es necesaria aquí
  // ya que las entregas son documentos separados.

  const nuevoProyecto = new Proyecto({
    nombre: data.nombre,
    descripcion: data.descripcion,
    clase: new mongoose.Types.ObjectId(data.claseId),
    tipoProyecto: {
      _id: new mongoose.Types.ObjectId(data.tipoProyectoId),
      nombre: data.tipoProyectoId, // Puedes ajustar esto para buscar el nombre real
      descripcion: '' // Puedes ajustar esto para buscar la descripción real
    },
    fechaEntrega: data.fechaEntrega,
  });

  return await nuevoProyecto.save();
};

export const getProyectosPorAlumno = async (alumnoId: string): Promise<IProyecto[]> => {
  // Ahora la consulta es más simple, ya que el proyecto no contiene las entregas.
  // Buscamos las clases a las que pertenece el alumno y luego los proyectos de esas clases.
  const clasesDelAlumno = await Clase.find({ alumnos: new mongoose.Types.ObjectId(alumnoId) }).select('_id');
  const idsDeClases = clasesDelAlumno.map(clase => clase._id);

  const proyectos = await Proyecto.find({ clase: { $in: idsDeClases } })
    .populate("clase tipoProyecto");

  return proyectos;
};

// Puedes añadir una función para obtener un proyecto por su ID si lo necesitas
export const getProyectoById = async (proyectoId: string): Promise<IProyecto | null> => {
  return await Proyecto.findById(proyectoId).populate("clase tipoProyecto");
};