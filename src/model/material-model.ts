// models/material.model.ts
import { Schema, model, Document, Types } from 'mongoose';
import { IClase } from './clase-model';// ya lo tenés
import { ITipoMaterial } from './tipoMaterial-model';// ya lo tenés

export interface IMaterial extends Document {
  nombre: string;
  tipo: Types.ObjectId | ITipoMaterial;
  clase: Types.ObjectId | IClase;
}

const materialSchema = new Schema<IMaterial>({
  nombre: { type: String, required: true },
  tipo: { type: Schema.Types.ObjectId, ref: 'TipoMaterial', required: true },
  clase: { type: Schema.Types.ObjectId, ref: 'Clase', required: true },
});

export const MaterialModel = model<IMaterial>('Material', materialSchema);
