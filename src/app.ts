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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      },
      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            nombreCompleto: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' },
            rol: { type: 'string' },
            activo: { type: 'boolean' }
          }
        },
        Clase: {
          type: 'object',
          properties: {
            nombre: { type: 'string' },
            materia: { type: 'string' },
            descripcion: { type: 'string' },
            clave: { type: 'string' },
            profesorId: { type: 'string' },
            alumnos: { type: 'array', items: { type: 'string' } },
            archivada: { type: 'boolean' }
          }
        },
        Proyecto: {
          type: 'object',
          properties: {
            nombre: { type: 'string' },
            descripcion: { type: 'string' },
            clase: { type: 'string' },
            tipoProyecto: { type: 'string' },
            fechaEntrega: { type: 'string' },
            estado: { type: 'string' }
          }
        },
        Entrega: {
          type: 'object',
          properties: {
            proyecto: { type: 'string' },
            alumno: { type: 'string' },
            comentario: { type: 'string' },
            archivoUrl: { type: 'string' },
            estado: { type: 'string' }
          }
        },
        Correccion: {
          type: 'object',
          properties: {
            entrega: { type: 'string' },
            nota: { type: 'number' },
            comentario: { type: 'string' }
          }
        },
        Material: {
          type: 'object',
          properties: {
            nombre: { type: 'string' },
            tipo: { type: 'string' },
            clase: { type: 'string' },
            url: { type: 'string' },
            rutaArchivo: { type: 'string' }
          }
        },
        TipoMaterial: {
          type: 'object',
          properties: {
            nombre: { type: 'string' },
            descripcion: { type: 'string' }
          }
        },
        TipoProyecto: {
          type: 'object',
          properties: {
            nombre: { type: 'string' },
            descripcion: { type: 'string' }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  
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
