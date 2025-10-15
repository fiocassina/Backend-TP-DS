import { Router } from "express";
import { auth } from '../middleware/auth.js';
import { crearProyecto, getProyectosAlumno, getProyectosPorClase, updateProyecto, deleteProyecto } from "../controllers/proyecto-controllers.js";
import { getProyectosPendientesAlumno } from "../controllers/entrega-controllers.js";

const router = Router();

router.post("/", auth, crearProyecto); 
router.get("/mis-proyectos", auth, getProyectosAlumno); 
router.get("/clase/:claseId", auth, getProyectosPorClase);
router.get("/pendientes", auth, getProyectosPendientesAlumno);
router.put("/:id", auth, updateProyecto);
router.delete("/:id", auth, deleteProyecto);
export default router;
