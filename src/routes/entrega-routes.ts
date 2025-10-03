import { Router } from "express";
import multer from "multer";
import { auth } from "../middleware/auth.js";
import { 
  crearEntrega, 
  getEntregasPorProyecto, 
  getEntregasPorAlumno, 
  getEntregaPorId 
} from "../controllers/entrega-controllers.js";

const router = Router();
const upload: any = multer({ dest: 'uploads/' });

// ----------------- RUTAS DE ENTREGAS -----------------

// Crear nueva entrega
router.post("/", auth, upload.single('archivoUrl'), crearEntrega);

// Obtener entregas de un proyecto
router.get("/proyecto/:proyectoId", auth, getEntregasPorProyecto);

// Obtener entregas del alumno autenticado
router.get("/alumno/mis-entregas", auth, getEntregasPorAlumno);

// Obtener detalle de una entrega específica
router.get("/:entregaId", auth, getEntregaPorId);

export default router;
