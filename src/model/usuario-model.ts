import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

// Interfaz para TypeScript
export interface IUsuario extends Document {
  nombreCompleto: string;
  email: string;
  password: string;
  activo: boolean;
  rol: string;
  resetPasswordToken: string | null; 
  resetPasswordExpires: Date | null;
  compararPassword: (password: string) => Promise<boolean>;
}

const usuarioSchema = new Schema<IUsuario>({
  nombreCompleto: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  activo: { type: Boolean, default: true }, // para baja logica
  
  resetPasswordToken: { type: String, default: null }, 
  resetPasswordExpires: { type: Date, default: null },
  
  rol: { 
    type: String, 
    enum: ['alumno', 'profesor'], 
    default: 'alumno' 
  },
}, {
  timestamps: true 
});


usuarioSchema.pre<IUsuario>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

usuarioSchema.methods.compararPassword = function (input: string) {
  return bcrypt.compare(input, this.password);
};

export default model<IUsuario>('Usuario', usuarioSchema);