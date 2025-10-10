import { Types } from "mongoose";
import Correccion, { ICorreccion } from "../model/correccion-model.js";
import Entrega from "../model/entrega-model.js"; // <-- IMPORTAR EL MODELO ENTREGA

export const crearCorreccion = async (data: {
  entrega: string;
  nota: number;
  comentario: string;
}): Promise<ICorreccion> => {

  const entregaAsociada = await Entrega.findById(data.entrega);
  if (!entregaAsociada) {
    throw new Error("La entrega especificada no existe.");
  }

  const nuevaCorreccion = new Correccion({
    entrega: data.entrega,
    nota: data.nota,
    comentario: data.comentario,
  });
  await nuevaCorreccion.save();

  const nuevoEstado = data.nota >= 6 ? 'aprobada' : 'desaprobada';

  entregaAsociada.correccion = nuevaCorreccion._id as Types.ObjectId;
  entregaAsociada.estado = nuevoEstado;
  await entregaAsociada.save();

  return nuevaCorreccion;
  
};

export const getCorreccionesPorEntrega = async (entregaId: string): Promise<ICorreccion[]> => {
  return await Correccion.find({ entrega: entregaId }).populate('entrega');
};

export const getTodasCorrecciones = async (): Promise<ICorreccion[]> => {
  return await Correccion.find().populate('entrega');
};