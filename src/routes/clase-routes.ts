import { Router, Request, Response } from 'express';
import {
  getAllClases,
  getClaseById,
  createClase,
  updateClase,
  deleteClase,
} from '../controllers/clase-controllers.js';

const router = Router();


router.get('/', getAllClases);
router.get('/:id', getClaseById);
router.post('/', createClase);
router.put('/:id', updateClase); 
router.patch('/:id', updateClase); 
router.delete('/:id', deleteClase);


export default router;