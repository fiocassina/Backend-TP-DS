import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUsuario extends Document {
  nombreCompleto: string;
  email: string;
  password: string;
  compararPassword: (password: string) => Promise<boolean>;
}


const usuarioSchema = new Schema<IUsuario>({
  nombreCompleto: { type: String, required: true,},
  email: {type: String, required: true, unique: true,},
  password: {type: String, required: true,},
});

usuarioSchema.pre<IUsuario>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});//convierte la contraseña a un hash antes de guardarla

usuarioSchema.methods.compararPassword = function (input: string) {
  return bcrypt.compare(input, this.password);
};//comparar contraseñas

export default model<IUsuario>('Usuario', usuarioSchema);