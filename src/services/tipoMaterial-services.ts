
import TipoMaterialModel, { ITipoMaterial } from '../model/tipoMaterial-model.js'; // Importación correcta del Modelo y la Interfaz


export const getAll = async (): Promise<ITipoMaterial[]> => {
  try {
    const tipos = await TipoMaterialModel.find(); // Mongoose: Encuentra todos los documentos en la colección
    return tipos;
  } catch (error) {
    console.error("Error en service getAll:", error);
    throw error; // Relanza el error para que el controlador lo capture
  }
};

export const getById = async (id: string): Promise<ITipoMaterial | null> => {
  try {
    const tipo = await TipoMaterialModel.findById(id);
    return tipo; 
  } catch (error) {
    console.error(`Error en service getById con ID ${id}:`, error);
    throw error; 
  }
};


export const create = async (data: { nombre: string; descripcion: string }): Promise<ITipoMaterial> => {
  try {
    const nuevoMaterial = new TipoMaterialModel(data); // Crea una nueva instancia del modelo
    await nuevoMaterial.save(); 
    return nuevoMaterial;
  } catch (error) {
    console.error("Error en service create:", error);
    throw error;
  }
};


export const update = async (id: string, data: Partial<ITipoMaterial>): Promise<ITipoMaterial | null> => {
  try {
    const tipoActualizado = await TipoMaterialModel.findByIdAndUpdate(id, data, { new: true });
    return tipoActualizado; 
  } catch (error) {
    console.error(`Error en service update con ID ${id}:`, error);
    throw error;
  }
};

export const remove = async (id: string): Promise<ITipoMaterial | null> => {
  try {
    const tipoEliminado = await TipoMaterialModel.findByIdAndDelete(id);
    return tipoEliminado; 
  } catch (error) {
    console.error(`Error en service remove con ID ${id}:`, error);
    throw error;
  }
};