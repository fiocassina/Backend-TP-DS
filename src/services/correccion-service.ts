import Correccion, { ICorreccion } from "../model/correccion-model.js";

export const crearCorreccion = async (data: {
  entrega: string;
  nota: number;
  comentario: string;
}): Promise<ICorreccion> => {
  const nuevaCorreccion = new Correccion({
    entrega: data.entrega,
    nota: data.nota,
    comentario: data.comentario,
  });

  return await nuevaCorreccion.save();
};

export const getCorreccionesPorEntrega = async (entregaId: string): Promise<ICorreccion[]> => {
  return await Correccion.find({ entrega: entregaId }).populate('entrega');
};

export const getTodasCorrecciones = async (): Promise<ICorreccion[]> => {
  return await Correccion.find().populate('entrega');
};
