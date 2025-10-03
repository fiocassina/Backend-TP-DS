import tipoProyectoModel, {ITipoProyecto} from "../model/tipoProyecto-model.js";

export const getAll = async (): Promise<ITipoProyecto[]> => {
  try {
      const tipos = await tipoProyectoModel.find(); 
      return tipos;
    } catch (error) {
      console.error("Error en service getAll:", error);
      throw error; 
    }
  };

export const getById = async (id: string): Promise<ITipoProyecto | null> => {
  try {
      const tipo = await tipoProyectoModel.findById(id);
      return tipo; 
    } catch (error) {
      console.error(`Error en service getById con ID ${id}:`, error);
      throw error; 
    }
  }

  export const create = async (data: { nombre: string; descripcion: string }): Promise<ITipoProyecto> => {
    try {
      const nuevoTipo = new tipoProyectoModel(data); 
      await nuevoTipo.save();
      return nuevoTipo;
    } catch (error) {
      console.error("Error en service create:", error);
      throw error;
    }   
  };

  export const update = async (id: string, data: Partial<ITipoProyecto>): Promise<ITipoProyecto | null> => {
    try {
      const tipoActualizado = await tipoProyectoModel.findByIdAndUpdate(id, data, { new: true });
      return tipoActualizado; 
    } catch (error) {
      console.error(`Error en service update con ID ${id}:`, error);
      throw error;
    }
  };
  export const remove = async (id: string): Promise<ITipoProyecto | null> => {
    try {
      const tipoEliminado = await tipoProyectoModel.findByIdAndDelete(id);
      return tipoEliminado;
    } catch (error) {
      console.error(`Error en service remove con ID ${id}:`, error);
      throw error;
    }
  };

  