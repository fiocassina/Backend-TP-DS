import { Router } from "express";
import { auth, esMiembroDeLaClase } from '../middleware/auth.js';
import { crearProyecto, getProyectosAlumno, getProyectosPorClase, updateProyecto, deleteProyecto, getProyectoById } from "../controllers/proyecto-controllers.js";
import { getProyectosPendientesAlumno } from "../controllers/entrega-controllers.js";

const router = Router();

router.post("/", auth, crearProyecto); 
router.get("/mis-proyectos", auth, getProyectosAlumno); 
router.get("/clase/:claseId", auth, esMiembroDeLaClase, getProyectosPorClase);
router.get("/pendientes", auth, getProyectosPendientesAlumno);
router.get("/:id", auth, getProyectoById);
router.put("/:id", auth, updateProyecto);
router.delete("/:id", auth, deleteProyecto);
export default router;
