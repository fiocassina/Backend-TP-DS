import mongoose, { Schema, Document } from "mongoose";

export interface ICorreccion extends Document {
    entrega: mongoose.Types.ObjectId; // referencia a la entrega
    fechaCorreccion: Date;
    nota: number;
    comentario: string;
}

const CorreccionSchema: Schema = new Schema({
    entrega: { type: mongoose.Schema.Types.ObjectId, ref: "Entrega", required: true },
    fechaCorreccion: { type: Date, default: Date.now },
    nota: { type: Number, required: true },
    comentario: { type: String, required: true },
});

export default mongoose.model<ICorreccion>("Correccion", CorreccionSchema);
