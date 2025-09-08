import { Schema, model, Document, Types } from 'mongoose';
import { IClase } from './clase-model';
import { ITipoMaterial } from './tipoMaterial-model';

export interface IMaterial extends Document {
  nombre: string;
  tipo: Types.ObjectId | ITipoMaterial;
  clase: Types.ObjectId | IClase;
  url?: string;
  rutaArchivo?: string;
  nombreArchivo?: string;
}

const materialSchema = new Schema<IMaterial>({
  nombre: { type: String, required: true },
  tipo: { type: Schema.Types.ObjectId, ref: 'TipoMaterial', required: true },
  clase: { type: Schema.Types.ObjectId, ref: 'Clase', required: true },
  url: { type: String, required: false },
  rutaArchivo: { type: String, required: false },
  nombreArchivo: { type: String, required: false },
});

export const MaterialModel = model<IMaterial>('Material', materialSchema);
