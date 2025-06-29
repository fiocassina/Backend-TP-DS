import { Router, Request, Response } from 'express';
import {
  getAllTiposMaterial,
  getTipoMaterialById,
  createTipoMaterial,
  updateTipoMaterial,
  deleteTipoMaterial,
} from '../controllers/tipoMaterial-controllers';

const router = Router();


router.get('/', getAllTiposMaterial);
router.get('/:id', getTipoMaterialById);
//router.post('/', createTipoMaterial);
router.put('/:id', updateTipoMaterial); 
router.patch('/:id', updateTipoMaterial); 
router.delete('/:id', deleteTipoMaterial);


export default router;