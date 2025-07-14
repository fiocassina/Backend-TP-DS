import express from 'express'
import tipoMaterialRoutes from './routes/tipoMaterial-routes.js'
import conectarDB from './config/db.js'
import cors from 'cors'

const app = express()
conectarDB()

app.use(cors()); // para permitir el acceso desde otros dominios

app.use(express.json()); // para poder recibir datos en formato JSON
app.use('/api/tipo-materiales', tipoMaterialRoutes)

export default app