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


router.post("/", auth, upload.single('archivoUrl'), crearEntrega);

router.get("/proyecto/:proyectoId", auth, getEntregasPorProyecto);

router.get("/alumno/mis-entregas", auth, getEntregasPorAlumno);

router.get("/:entregaId", auth, getEntregaPorId);

export default router;
