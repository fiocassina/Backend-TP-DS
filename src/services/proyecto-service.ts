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
  if (!clase) throw new Error("Clase no encontrada");

  // Inicializamos entregas para todos los alumnos
  const entregasIniciales = clase.alumnos.map(alumnoId => ({
    alumno: alumnoId,
    estado: "pendiente"
  }));

  const nuevoProyecto = new Proyecto({
    nombre: data.nombre,
    descripcion: data.descripcion,
    clase: new mongoose.Types.ObjectId(data.claseId),
    tipoProyecto: new mongoose.Types.ObjectId(data.tipoProyectoId),
    fechaEntrega: data.fechaEntrega,
    entregas: entregasIniciales
  });

  return await nuevoProyecto.save();
};

// Función para entregar tarea
export const entregarTarea = async (proyectoId: string, alumnoId: string, archivoUrl: string): Promise<IProyecto | null> => {
  const proyecto = await Proyecto.findById(proyectoId);
  if (!proyecto) throw new Error("Proyecto no encontrado");

  const entrega = proyecto.entregas.find(e => e.alumno.toString() === alumnoId);
  if (!entrega) throw new Error("Alumno no pertenece a este proyecto");

  const ahora = new Date();
  entrega.archivoUrl = archivoUrl;
  entrega.fechaEntrega = ahora;
  entrega.estado = ahora > proyecto.fechaEntrega ? "tarde" : "entregado";

  return await proyecto.save();
};

// Obtener proyectos por alumno
export const getProyectosPorAlumno = async (alumnoId: string): Promise<IProyecto[]> => {
  return await Proyecto.find({ "entregas.alumno": alumnoId }).populate("clase tipoProyecto");
};
