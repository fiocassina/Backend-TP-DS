import { Schema, model, Document, Types } from "mongoose";
import crypto from 'crypto'; // Importamos crypto para generar la clave de la clase

export interface IClase extends Document {
    nombre: string;
    materia: string;
    descripcion: string;
    clave: string;
    profesorId: Types.ObjectId; 
    alumnos: Types.ObjectId[]; 
}

const claseSchema = new Schema<IClase>({
    nombre: { type: String, required: true, trim: true },
    materia: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true },
    clave: { type: String, unique: true },
    profesorId: {
        type: Schema.Types.ObjectId, 
        ref: 'Usuario',
        required: true
    },
    alumnos: [{
        type: Schema.Types.ObjectId, 
        ref: 'Usuario' 
    }] 
}, {
    timestamps: true
});


claseSchema.pre<IClase>('save', function (next) {
if (this.isNew) {   
        this.clave = crypto.randomBytes(3).toString('hex').toUpperCase();  // Genera un código aleatorio de 6 caracteres en mayúsculas
    }
    next(); 
});

export default model<IClase>('Clase', claseSchema);