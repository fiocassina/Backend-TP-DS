import { Schema, model, Document, Types } from "mongoose";
import { IClase } from "./clase-model.js";

export interface IProyecto extends Document {
  nombre: string;
  descripcion?: string;
  clase: Types.ObjectId;
  tipoProyecto: Types.ObjectId;
  fechaCreacion: Date;
  fechaEntrega: Date;
  estado: 'activo' | 'cancelado' | 'finalizado';
}

const proyectoSchema = new Schema<IProyecto>({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  clase: { type: Schema.Types.ObjectId, ref: "Clase", required: true },
  tipoProyecto: { type: Schema.Types.ObjectId, ref: "TipoProyecto", required: true },
  fechaCreacion: { type: Date, default: Date.now },
  fechaEntrega: { type: Date, required: true },
  estado: {
        type: String,
        enum: ['activo', 'cancelado', 'finalizado'],
        default: 'activo'
    }
});

export default model<IProyecto>("Proyecto", proyectoSchema);
