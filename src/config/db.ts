import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TipoMaterialModel from '../model/tipoMaterial-model.js'; // Importamos el modelo

dotenv.config({ path: 'variables.env' });

// pre carga tipos material
const seedTiposMaterial = async (): Promise<void> => {
    try {
    const tiposMaterial = [
    { nombre: 'PDF', descripcion: 'Material en formato PDF' },
    { nombre: 'Imagen', descripcion: 'Material en formato de imagen (JPG, PNG, etc.)' },
    { nombre: 'Enlace web', descripcion: 'Un enlace a un recurso externo' }
    ];

    await Promise.all(tiposMaterial.map(async (tipo) => {
    await TipoMaterialModel.findOneAndUpdate(
        { nombre: tipo.nombre }, 
        { $setOnInsert: tipo },  
        { upsert: true, new: true } 
    );
    }));

    console.log('Tipos de material por defecto creados.');

} catch (error) {
    if (process.env.NODE_ENV !== 'test') { 
        console.error('Error al crear los tipos de material por defecto:', error);
        process.exit(1);
    }
}
};

const conectarDB = async (): Promise<void> => {
    try {
        if (!process.env.DB_MONGO) {
            console.error('Error: La variable de entorno DB_MONGO no está definida.');
            process.exit(1);
        }
        await mongoose.connect(process.env.DB_MONGO);
        
        console.log('Base de datos conectada');

        await seedTiposMaterial();

    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    }
};

export default conectarDB;