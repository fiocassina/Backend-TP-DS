import { Router } from "express";
import { auth } from '../middleware/auth.js';
import { crearProyecto, getProyectosAlumno, getProyectosPorClase } from "../controllers/proyecto-controller.js";

const router = Router();

router.post("/", auth, crearProyecto); // Crear proyecto (solo profesor)
router.get("/mis-proyectos", auth, getProyectosAlumno); // Ver proyectos de alumno
// proyecto-routes.ts
router.get("/clase/:claseId", auth, getProyectosPorClase);

export default router;
