import { Router, Request, Response } from 'express';
import { auth } from '../middleware/auth.js';
import {
  getMisClases,
  getClaseById,
  createClase,
  updateClase,
  deleteClase,
  inscribirAlumno,
} from '../controllers/clase-controllers.js';

const router = Router();


router.get('/',auth, getMisClases);
router.get('/:id', getClaseById);
router.post('/',auth, createClase);
router.put('/:id', updateClase); 
router.patch('/:id', updateClase); 
router.delete('/:id', deleteClase);
router.post('/inscribir', auth, inscribirAlumno);

export default router;