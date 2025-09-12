
import mongoose, { Schema, Document } from 'mongoose';

// interfaz para el modelo de TipoMaterial
export interface ITipoMaterial extends Document {
  nombre: string;
  descripcion: string;
}

// esquema para TipoMaterial
const tipoMaterialSchema: Schema = new Schema({
  nombre: {
    type: String,
    required: true, 
    unique: true,  
    trim: true      // Opcional: Elimina espacios en blanco al inicio/final
  },
  descripcion: {
    type: String,
    required: true, 
    trim: true       
  }
});

// modelo de TipoMaterial
const TipoMaterialModel = mongoose.model<ITipoMaterial>('TipoMaterial', tipoMaterialSchema);
export default TipoMaterialModel;
