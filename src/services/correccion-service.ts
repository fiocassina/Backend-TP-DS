import { Types } from "mongoose";
import Correccion, { ICorreccion } from "../model/correccion-model.js";
import Entrega from "../model/entrega-model.js";

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

export const actualizarCorreccion = async (id: string, data: { nota: number; comentario: string }) => {
  
  const correccionActualizada = await Correccion.findByIdAndUpdate(
      id,
      {
          nota: data.nota,
          comentario: data.comentario,
          fechaCorreccion: new Date()
      },
      { new: true } 
  );

  if (!correccionActualizada) {
      throw new Error("Corrección no encontrada");
  }

  const entrega = await Entrega.findById(correccionActualizada.entrega);
  
  if (entrega) {
      const nuevoEstado = data.nota >= 6 ? 'aprobada' : 'desaprobada';
      if (entrega.estado !== nuevoEstado) {
          entrega.estado = nuevoEstado;
          await entrega.save();
      }
  }

  return correccionActualizada;
};

export const eliminarCorreccion = async (id: string): Promise<void> => {
  const correccion = await Correccion.findById(id);
  
  if (!correccion) {
    throw new Error("Corrección no encontrada");
  }

  // Restaurar la entrega al estado pendiente
  const entrega = await Entrega.findById(correccion.entrega);
  if (entrega) {
    entrega.correccion = undefined;
    entrega.estado = 'pendiente';
    await entrega.save();
  }

  // Eliminar la corrección
  await Correccion.findByIdAndDelete(id);
};