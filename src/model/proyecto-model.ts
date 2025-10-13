import { Schema, model, Document, Types } from "mongoose";
import { IClase } from "./clase-model.js";

export interface IProyecto extends Document {
  nombre: string;
  descripcion?: string;
  clase: Types.ObjectId | IClase;
  tipoProyecto: Types.ObjectId;
  fechaCreacion: Date;
  fechaEntrega: Date;
}

const proyectoSchema = new Schema<IProyecto>({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  clase: { type: Schema.Types.ObjectId, ref: "Clase", required: true },
  tipoProyecto: { type: Schema.Types.ObjectId, ref: "TipoProyecto", required: true }, // ✅ ref agregado
  fechaCreacion: { type: Date, default: Date.now },
  fechaEntrega: { type: Date, required: true }
});

export default model<IProyecto>("Proyecto", proyectoSchema);
