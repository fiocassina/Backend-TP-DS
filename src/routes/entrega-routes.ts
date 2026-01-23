import { Router } from 'express';
import { auth, esProfeDeLaClase } from '../middleware/auth.js'; 
import {
  getMisClases,
  getClaseById,
  createClase,
  updateClase,
  deleteClase,
  inscribirAlumno,
} from '../controllers/clase-controllers.js';

const router = Router();


router.get('/', auth, getMisClases);
router.get('/:id', auth, getClaseById);


router.post('/', auth, createClase); 


router.put('/:id', auth, esProfeDeLaClase, updateClase); 
router.patch('/:id', auth, esProfeDeLaClase, updateClase); 
router.delete('/:id', auth, esProfeDeLaClase, deleteClase);


router.post('/inscribir', auth, inscribirAlumno); 

export default router;