import Entrega, { IEntrega } from "../model/entrega-model.js";
import Proyecto from "../model/proyecto-model.js";

export const crearEntrega = async (
  proyectoId: string,
  alumnoId: string,
  comentario?: string,
  archivoUrl?: string,
  tipoArchivo?: "pdf" | "imagen"
): Promise<IEntrega> => {
  const proyecto = await Proyecto.findById(proyectoId);
  if (!proyecto) throw new Error("Proyecto no encontrado");

  const ahora = new Date();
  const estado: "entregado" | "tarde" = ahora > proyecto.fechaEntrega ? "tarde" : "entregado";

  const nuevaEntrega = new Entrega({
    proyecto: proyectoId,
    alumno: alumnoId,
    comentario,
    archivoUrl,
    tipoArchivo,
    fechaEntrega: ahora,
    estado
  });

  const entregaGuardada = await nuevaEntrega.save();

  const entregaPoblada = await Entrega.findById(entregaGuardada._id)
    .populate("proyecto")
    .populate("alumno")
    .exec();

  if (!entregaPoblada) throw new Error("No se pudo poblar la entrega");

  return entregaPoblada;
};

export const getEntregasPorProyecto = async (proyectoId: string): Promise<IEntrega[]> => {
  return await Entrega.find({ proyecto: proyectoId })
    .populate("proyecto")
    .populate("alumno")
    .exec();
};

export const getEntregasPorAlumno = async (alumnoId: string): Promise<IEntrega[]> => {
  return await Entrega.find({ alumno: alumnoId })
    .populate("proyecto")
    .populate("alumno")
    .exec();
};
