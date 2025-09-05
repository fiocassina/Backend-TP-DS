import { Schema, model, Document } from "mongoose";
import crypto from 'crypto'; // Importamos crypto para generar la clave de la clase

export interface IClase extends Document {
    nombre: string;
    materia: string;
    descripcion: string;
    clave: string;
    profesorId: string;
    alumnos: string[]; // ids de los alumnos
}

const claseSchema = new Schema<IClase>({
    nombre: { type: String, required: true, trim: true },
    materia: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true },
    clave: { type: String, unique: true },
    profesorId: { type: String, required: true }, alumnos: { type: [String], default: [] } // <-- inicializamos vacío
}, {
    timestamps: true
});


claseSchema.pre<IClase>('save', function (next) {
   if (this.isNew) {   //para que sólo se ejecute al crear una nueva clase, no al actualizar
        this.clave = crypto.randomBytes(3).toString('hex').toUpperCase();  // Genera un código aleatorio de 6 caracteres en mayúsculas
        // (son 3 bytes pero hace el pasaje a hexadecimal que duplica la cantidad de caracteres)
    }
    next(); 
});

export default model<IClase>('Clase', claseSchema);