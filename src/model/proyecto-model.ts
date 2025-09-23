import { Schema, model, Document, Types } from "mongoose";
import { IClase } from "./clase-model.js";

export interface IProyecto extends Document {
  nombre: string;
  descripcion?: string;
  clase: Types.ObjectId | IClase;
  tipoProyecto: {
    _id: Types.ObjectId;
    nombre: string;
    descripcion?: string;
  };
  fechaCreacion: Date;
  fechaEntrega: Date;
}

const proyectoSchema = new Schema<IProyecto>({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  clase: { type: Schema.Types.ObjectId, ref: "Clase", required: true },
  tipoProyecto: {
    _id: { type: Schema.Types.ObjectId, required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String }
  },
  fechaCreacion: { type: Date, default: Date.now },
  fechaEntrega: { type: Date, required: true }
});

export default model<IProyecto>("Proyecto", proyectoSchema);