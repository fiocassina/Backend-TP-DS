import ClaseModel, {IClase} from '../model/clase-model.js';
import mongoose from 'mongoose';
import { MaterialModel } from '../model/material-model.js';


export const getAll = async (): Promise<IClase[]> => {
  try {
    const clases = await ClaseModel.find(); 
    return clases;
  } catch (error) {
    console.error("Error en service getAll:", error);
    throw error; 
  }
};

export const getById = async (id: string): Promise<IClase | null> => {
  try {
    const clase = await ClaseModel.findById(id);
    return clase; 
  } catch (error) {
    console.error(`Error en service getById con ID ${id}:`, error);
    throw error; 
  }
};


export const create = async (data: { 
  nombre: string; 
  materia: string; 
  descripcion?: string; 
  profesorId: string; 
}): Promise<IClase> => {
  try {
    const nuevaClase = new ClaseModel({
      nombre: data.nombre,
      materia: data.materia,
      descripcion: data.descripcion,
      profesorId: data.profesorId
    });

    await nuevaClase.save(); 
    return nuevaClase;
  } catch (error) {
    console.error("Error en service create:", error);
    throw error;
  }
};


export const update = async (id: string, data: Partial<IClase>): Promise<IClase | null> => {
  try {
    const claseActualizada = await ClaseModel.findByIdAndUpdate(id, data, { new: true });
    return claseActualizada; 
  } catch (error) {
    console.error(`Error en service update con ID ${id}:`, error);
    throw error;
  }
};

export const remove = async (id: string): Promise<IClase | null> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID de clase inválido');
    }

    await MaterialModel.deleteMany({ clase: id });

    const claseEliminada = await ClaseModel.findByIdAndDelete(id);

    return claseEliminada; 
  } catch (error) {
    console.error(`Error en service remove con ID ${id}:`, error);
    throw error;
  }
};

export const getByClave = async (clave: string): Promise<IClase | null> => {
  try {
    const clase = await ClaseModel.findOne({ clave: clave });
    return clase; 
  } catch (error) {
    console.error(`Error en service getByClave con clave ${clave}:`, error);
    throw error; 
  }
}