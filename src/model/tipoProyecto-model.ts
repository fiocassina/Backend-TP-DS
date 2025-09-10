import { Schema, model, Document } from "mongoose";


export interface ITipoProyecto extends Document {
  nombre: string;
  descripcion: string;
}

//estructura
const tipoProyectoSchema = new Schema<ITipoProyecto>({
  nombre: { type: String, required: true, unique: true, trim: true },
  descripcion: {type: String, trim: true}}
);


export default model<ITipoProyecto>('TipoProyecto', tipoProyectoSchema);