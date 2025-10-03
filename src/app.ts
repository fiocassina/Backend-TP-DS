import express from 'express'
import tipoMaterialRoutes from './routes/tipoMaterial-routes.js'
import usuarioRoutes from './routes/usuario-routes.js'
import claseRoutes from './routes/clase-routes.js'
import proyectoRoutes from './routes/proyecto-routes.js'
import materialRoutes from './routes/material-routes.js'
import tipoProyectoRoutes from './routes/tipoProyecto-routes.js'
import conectarDB from './config/db.js'
import cors from 'cors'
import entregaRoutes from './routes/entrega-routes.js'
import correccionRoutes from "./routes/correccion-routes.js";



const app = express()
conectarDB()


app.use('/uploads', express.static('uploads')); 
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api/tipo-materiales', tipoMaterialRoutes)
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/clases', claseRoutes)
app.use('/api/proyectos', proyectoRoutes)
app.use('/api/material', materialRoutes); 
app.use('/api/tipo-proyectos', tipoProyectoRoutes)
app.use('/api/entregas', entregaRoutes)
app.use("/api/correcciones", correccionRoutes);

export default app
