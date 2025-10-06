import mongoose, { Schema, Document } from "mongoose";

// Definimos los estados posibles para mayor claridad y autocompletado
export type EstadoEntrega = 'pendiente' | 'aprobada' | 'desaprobada';

export interface Entrega extends Document {
  proyecto: mongoose.Types.ObjectId;
  alumno: mongoose.Types.ObjectId;
  comentario?: string;
  archivoUrl?: string;
  fechaEntrega: Date;
  correccion?: mongoose.Types.ObjectId;
  estado: EstadoEntrega; 
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
  },
  correccion: {
    type: Schema.Types.ObjectId,
    ref: "Correccion",
    required: false,
    unique: true
  },
  estado: {
    type: String,
    required: true,
    enum: ['pendiente', 'aprobada', 'desaprobada'],
    default: 'pendiente' // Por defecto, una entrega siempre está pendiente
  }
}, {
  timestamps: true
});

export default mongoose.model<Entrega>("Entrega", entregaSchema);