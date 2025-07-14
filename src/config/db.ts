// src/config/db.ts
import mongoose from 'mongoose'; // Usamos 'import' en TS
import dotenv from 'dotenv';     // Usamos 'import' para dotenv

dotenv.config({ path: 'variables.env' }); // Carga las variables de entorno

const conectarDB = async (): Promise<void> => { 
    try {
        if (!process.env.DB_MONGO) {
            console.error('Error: La variable de entorno DB_MONGO no está definida.');
            process.exit(1);
        }
        await mongoose.connect(process.env.DB_MONGO);
        
        console.log('Base de datos conectada'); 
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error); 
        process.exit(1); 
    }
};

export default conectarDB; // Exportamos la función para que pueda ser utilizada en otros archivos