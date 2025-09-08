import { MaterialModel, IMaterial } from '../model/material-model.js';

export const getAll = async () => {
  return MaterialModel.find().populate('tipo').populate('clase');
};

export const getById = async (id: string) => {
  return MaterialModel.findById(id).populate('tipo').populate('clase');
};

export const getByClase = async (claseId: string) => {
  return MaterialModel.find({ clase: claseId }).populate('tipo');
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

  return MaterialModel.create(newMaterialData);
};

export const update = async (id: string, data: any) => {
  return MaterialModel.findByIdAndUpdate(id, data, { new: true });
};

export const remove = async (id: string) => {
  return MaterialModel.findByIdAndDelete(id);
};
