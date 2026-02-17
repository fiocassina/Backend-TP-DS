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
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';



const app = express()
conectarDB()

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Studyroom',
      version: '1.0.0',
      description: 'Documentación de la API para TP de DSW',
    },
    servers: [
      {
        url: process.env.BACKEND_URL || 'http://localhost:8080',
        description: "Servidor Principal"      },
    ],
  },
  apis: ['./src/routes/*.ts', './routes/*.js', './src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/uploads', express.static('uploads')); 
app.use(cors({

  origin: process.env.FRONTEND_URL || 'http://localhost:4200', 
  credentials: true, // Esto es importante si más adelante usan cookies o sesiones
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/tipo-materiales', tipoMaterialRoutes)
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/clases', claseRoutes)
app.use('/api/proyectos', proyectoRoutes)
app.use('/api/material', materialRoutes); 
app.use('/api/tipo-proyectos', tipoProyectoRoutes)
app.use('/api/entregas', entregaRoutes)
app.use("/api/correcciones", correccionRoutes);

export default app
