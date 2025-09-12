import { Router } from "express";
import { auth } from '../middleware/auth.js';
import { crearProyecto, entregarTarea, getProyectosAlumno, getProyectosPorClase } from "../controllers/proyecto-controller.js";

const router = Router();

router.post("/", auth, crearProyecto); // Crear proyecto (solo profesor)
router.post("/entregar", auth, entregarTarea); // Entregar tarea (alumno)
router.get("/mis-proyectos", auth, getProyectosAlumno); // Ver proyectos de alumno
// proyecto-routes.ts
router.get("/clase/:claseId", auth, getProyectosPorClase);

export default router;
