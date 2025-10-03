import { Router } from "express";
import * as correccionController from "../controllers/correccion-controller.js";

const router = Router();

// Crear una corrección
router.post("/", correccionController.crearCorreccion);

// Obtener todas las correcciones de una entrega específica
router.get("/entrega/:entregaId", correccionController.getCorreccionesPorEntrega);

// Obtener todas las correcciones
router.get("/", correccionController.getTodasCorrecciones);

export default router;
