import { Router } from "express";
import multer from "multer";
import { auth, checkRole} from "../middleware/auth.js";
import { 
  crearEntrega, 
  getEntregasPorProyecto, 
  getEntregasPorAlumno, 
  getEntregaPorId,
  getReporteAprobadas,
  getProyectosPendientesAlumno
} from "../controllers/entrega-controllers.js";

const router = Router();
const upload: any = multer({ dest: 'uploads/' });


router.post("/", auth, upload.single('archivoUrl'), crearEntrega);

router.get("/proyecto/:proyectoId", auth, getEntregasPorProyecto);

router.get("/alumno/mis-entregas", auth, getEntregasPorAlumno);

router.get("/:entregaId", auth, getEntregaPorId);

router.get("/reporte/aprobadas", auth, checkRole('profesor'), getReporteAprobadas);

router.get('/pendientes/alumno', auth, getProyectosPendientesAlumno);


export default router;
