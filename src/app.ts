import express from 'express'
import tipoMaterialRoutes from './routes/tipoMaterial-routes.js'
import usuarioRoutes from './routes/usuario-routes.js'
import claseRoutes from './routes/clase-routes.js'
import materialRoutes from './routes/material-routes.js'
import conectarDB from './config/db.js'
import cors from 'cors'

const app = express()
conectarDB()

app.use(cors()); // para permitir el acceso desde otros dominios

app.use(express.json()); // para poder recibir datos en formato JSON
app.use('/api/tipo-materiales', tipoMaterialRoutes)
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/clases', claseRoutes)
app.use('/api/material', materialRoutes ); // Agregar esta línea para las rutas de materiales

export default app