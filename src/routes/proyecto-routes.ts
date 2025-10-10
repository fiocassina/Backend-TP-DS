import { Router } from "express";
import { auth } from '../middleware/auth.js';
import { crearProyecto, getProyectosAlumno, getProyectosPorClase } from "../controllers/proyecto-controller.js";
import { getProyectosPendientesAlumno } from "../controllers/entrega-controllers.js";

const router = Router();

router.post("/", auth, crearProyecto); 
router.get("/mis-proyectos", auth, getProyectosAlumno); 
router.get("/clase/:claseId", auth, getProyectosPorClase);
router.get("/pendientes", auth, getProyectosPendientesAlumno);

export default router;
