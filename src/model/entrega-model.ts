import mongoose, { Schema, Document } from "mongoose";

export interface Entrega extends Document {
  proyecto: mongoose.Types.ObjectId;  // referencia a Proyecto
  alumno: mongoose.Types.ObjectId;    // referencia a Usuario
  comentario?: string;
  archivoUrl?: string;
  fechaEntrega: Date;
}

const entregaSchema = new Schema<Entrega>({
  proyecto: {
    type: Schema.Types.ObjectId,
    ref: "Proyecto",
    required: true
  },
  alumno: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  comentario: {
    type: String,
    trim: true
  },
  archivoUrl: {
    type: String
  },
  fechaEntrega: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // crea createdAt y updatedAt automáticamente
});

export default mongoose.model<Entrega>("Entrega", entregaSchema);
