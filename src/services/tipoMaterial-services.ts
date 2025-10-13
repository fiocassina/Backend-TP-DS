
import TipoMaterialModel, { ITipoMaterial } from '../model/tipoMaterial-model.js'; 


export const getAll = async (): Promise<ITipoMaterial[]> => {
  try {
    const tipos = await TipoMaterialModel.find(); 
    return tipos;
  } catch (error) {
    console.error("Error en service getAll:", error);
    throw error; 
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

