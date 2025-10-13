import { Router } from 'express';
import {
  getAllTiposMaterial,
  getTipoMaterialById,
} from '../controllers/tipoMaterial-controllers.js';

const router = Router();

router.get('/', getAllTiposMaterial);
router.get('/:id', getTipoMaterialById);

export default router;