import { Router, Response } from "express"; 
import {
  getAllTiposProyecto,
  getTipoProyectoById,
  createTipoProyecto,
  updateTipoProyecto,
  deleteTipoProyecto, 
} from "../controllers/tipoProyecto-controllers.js";

const router = Router();

router.get('/', getAllTiposProyecto);
router.get('/:id', getTipoProyectoById);
router.post('/', createTipoProyecto);
router.put('/:id', updateTipoProyecto);
router.delete('/:id', deleteTipoProyecto);

export default router;


