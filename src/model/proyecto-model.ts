import { Schema, model, Document, Types } from "mongoose";
import { IClase } from "./clase-model.js";

interface IEntrega {
  alumno: Types.ObjectId;
  estado: "pendiente" | "entregado" | "tarde";
  archivoUrl?: string;
  fechaEntrega?: Date;
}

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
  entregas: IEntrega[];
}

const entregaSchema = new Schema<IEntrega>({
  alumno: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  estado: { type: String, enum: ["pendiente", "entregado", "tarde"], default: "pendiente" },
  archivoUrl: { type: String },
  fechaEntrega: { type: Date }
});

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
  fechaEntrega: { type: Date, required: true },
  entregas: [entregaSchema]
});

export default model<IProyecto>("Proyecto", proyectoSchema);
