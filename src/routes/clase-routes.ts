import { Router } from 'express';
import { auth, esProfeDeLaClase, esMiembroDeLaClase } from '../middleware/auth.js'; 
import {
  getMisClases,
  getClaseById,
  createClase,
  updateClase,
  deleteClase,
  inscribirAlumno,
  expulsarAlumno,
  checkSoyAlumno
} from '../controllers/clase-controllers.js';

const router = Router();

router.get('/', auth, getMisClases);

router.get('/verificar-alumno', auth, checkSoyAlumno);

router.get('/:id', auth, esMiembroDeLaClase, getClaseById); 

router.post('/', auth, createClase); 

router.put('/:id', auth, esProfeDeLaClase, updateClase); 
router.patch('/:id', auth, esProfeDeLaClase, updateClase); 
router.delete('/:id', auth, esProfeDeLaClase, deleteClase);

router.delete('/:id/alumnos/:alumnoId', auth, esProfeDeLaClase, expulsarAlumno);

router.post('/inscribir', auth, inscribirAlumno); 

export default router;