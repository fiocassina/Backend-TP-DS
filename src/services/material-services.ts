// src/services/material-services.ts
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

export const create = async (data: { nombre: string; tipoId: string; claseId: string }) => {
  return MaterialModel.create({
    nombre: data.nombre,
    tipo: data.tipoId,
    clase: data.claseId,
  });
};

export const update = async (id: string, data: any) => {
  return MaterialModel.findByIdAndUpdate(id, data, { new: true });
};

export const remove = async (id: string) => {
  return MaterialModel.findByIdAndDelete(id);
};
