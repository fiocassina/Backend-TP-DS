import { Schema, model, Document, Types } from "mongoose";
import { IProyecto } from "./proyecto-model.js";
import { IUsuario } from "./usuario-model.js";

export interface IEntrega extends Document {
  proyecto: Types.ObjectId | IProyecto;
  alumno: Types.ObjectId | IUsuario;
  comentario?: string;
  archivoUrl?: string;
  fechaEntrega: Date;
}

const entregaSchema = new Schema<IEntrega>({
  proyecto: { type: Schema.Types.ObjectId, ref: "Proyecto", required: true },
  alumno: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  comentario: { type: String },
  archivoUrl: { type: String },
  fechaEntrega: { type: Date, default: Date.now }
});

export default model<IEntrega>("Entrega", entregaSchema);