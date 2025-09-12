import express from 'express'
import tipoMaterialRoutes from './routes/tipoMaterial-routes.js'
import usuarioRoutes from './routes/usuario-routes.js'
import claseRoutes from './routes/clase-routes.js'
import proyectoRoutes from './routes/proyecto-routes.js'
import materialRoutes from './routes/material-routes.js'
import tipoProyectoRoutes from './routes/tipoProyecto-routes.js'
import conectarDB from './config/db.js'
import cors from 'cors'

const app = express()
conectarDB()

// Para servir archivos estáticos (imágenes, PDFs, etc.) desde la carpeta 'uploads'
//app.use(express.static('uploads'));
app.use('/uploads', express.static('uploads')); 
app.use(cors()); // para permitir el acceso desde otros dominios

// Para poder recibir datos en formato JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// IMPORTANTE: Se elimina el middleware global de Multer
// El middleware de Multer ahora se usa solo en la ruta específica
// que necesita manejar la subida de archivos (materialRoutes)
// ✅ REMOVIDO: const upload = multer(); app.use(upload.any());

app.use('/api/tipo-materiales', tipoMaterialRoutes)
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/clases', claseRoutes)
app.use('/api/proyectos', proyectoRoutes)
app.use('/api/material', materialRoutes); // Agregar esta línea para las rutas de materiales
app.use('/api/tipo-proyectos', tipoProyectoRoutes)

export default app
