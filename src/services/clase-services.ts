import ClaseModel, {IClase} from '../model/clase-model.js';


export const getAll = async (): Promise<IClase[]> => {
  try {
    const clases = await ClaseModel.find(); // Mongoose: Encuentra todos los documentos en la colección
    return clases;
  } catch (error) {
    console.error("Error en service getAll:", error);
    throw error; // Relanza el error para que el controlador lo capture
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
    // ✅ Crea la instancia con los datos (el modelo se encargará de generar la clave automáticamente)
    const nuevaClase = new ClaseModel({
      nombre: data.nombre,
      materia: data.materia,
      descripcion: data.descripcion,
      profesorId: data.profesorId
      // ¡No incluyas "clave" aquí! El modelo la genera automáticamente
    });

    await nuevaClase.save(); // ✅ Al guardar, se ejecutará el "pre('save')" que genera la clave
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