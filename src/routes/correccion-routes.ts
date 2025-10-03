import { Router } from "express";
import * as correccionController from "../controllers/correccion-controller.js";

const router = Router();

router.post("/", correccionController.crearCorreccion);

router.get("/entrega/:entregaId", correccionController.getCorreccionesPorEntrega);

router.get("/", correccionController.getTodasCorrecciones);

export default router;
