import { Router } from "express";
import * as correccionController from "../controllers/correccion-controller.js";

const router = Router();

router.post("/", correccionController.crearCorreccion);

router.get("/entrega/:entregaId", correccionController.getCorreccionesPorEntrega);

router.get("/", correccionController.getTodasCorrecciones);

router.put("/:id", correccionController.actualizarCorreccion); 

export default router;