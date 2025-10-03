
import mongoose, { Schema, Document } from 'mongoose';

export interface ITipoMaterial extends Document {
  nombre: string;
  descripcion: string;
}

const tipoMaterialSchema: Schema = new Schema({
  nombre: {
    type: String,
    required: true, 
    unique: true,  
    trim: true      //Elimina espacios en blanco al inicio/final
  },
  descripcion: {
    type: String,
    required: true, 
    trim: true       
  }
});

const TipoMaterialModel = mongoose.model<ITipoMaterial>('TipoMaterial', tipoMaterialSchema);
export default TipoMaterialModel;
