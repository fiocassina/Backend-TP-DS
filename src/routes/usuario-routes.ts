import { Router } from 'express';
import { registrar, login, getPerfil, updatePerfil, desactivarPerfil } from '../controllers/usuario-controller.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.post('/registrar', registrar);
router.post('/login', login);

router.get('/perfil', auth, getPerfil);
router.put('/perfil', auth, updatePerfil);
router.delete('/perfil', auth, desactivarPerfil); 


export default router;
