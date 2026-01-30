import { MaterialModel } from '../model/material-model.js';

// SOLUCIÓN DEFINITIVA: Casteamos el modelo a 'any' ANTES de llamar a find().
// Esto evita que TypeScript intente calcular la unión de tipos compleja que causa el error TS2590.

export const getAll = async () => {
  return (MaterialModel as any).find()
    .populate('tipo')
    .populate('clase')
    .lean();
};

export const getById = async (id: string) => {
  return (MaterialModel as any).findById(id)
    .populate('tipo')
    .populate('clase')
    .lean();
};

export const getByClase = async (claseId: string) => {
  return (MaterialModel as any).find({ clase: claseId })
    .populate('tipo')
    .lean();
};

export const create = async (data: { nombre: string; tipo: string; clase: string; url?: string; rutaArchivo?: string; nombreArchivo?: string }) => {
  const newMaterialData: any = {
    nombre: data.nombre,
    tipo: data.tipo,
    clase: data.clase,
  };

  if (data.url) {
    newMaterialData.url = data.url;
  }

  if (data.rutaArchivo) {
    newMaterialData.rutaArchivo = data.rutaArchivo;
    newMaterialData.nombreArchivo = data.nombreArchivo;
  }

  // Aquí no suele fallar, pero si falla, usá (MaterialModel as any).create(...)
  return MaterialModel.create(newMaterialData);
};

export const update = async (id: string, data: any) => {
  return (MaterialModel as any).findByIdAndUpdate(id, data, { new: true });
};

export const remove = async (id: string) => {
  return (MaterialModel as any).findByIdAndDelete(id);
};