import express from 'express'
import tipoMaterialRoutes from './routes/tipoMaterial-routes.js'


const app = express()
app.use(express.json())
app.use('/api/tipo-materiales', tipoMaterialRoutes)

export default app