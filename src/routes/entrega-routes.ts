import { Router } from "express";
import multer from "multer"; // Importa multer
import { auth } from "../middleware/auth.js";
import { crearEntrega, getEntregasPorProyecto, getEntregasPorAlumno } from "../controllers/entrega-controllers.js";
const router = Router();
const upload = multer({ dest: 'uploads/' }); // Configura multer directamente

router.post("/", auth, upload.single('archivoUrl'), crearEntrega);
router.get("/proyecto/:proyectoId", auth, getEntregasPorProyecto);
router.get("/alumno/mis-entregas", auth, getEntregasPorAlumno);

export default router;