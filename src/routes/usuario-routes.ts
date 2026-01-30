import { Router } from 'express';
import { registrar, login, getPerfil, updatePerfil, desactivarPerfil, olvideContrasena, nuevaContrasena } from '../controllers/usuario-controller.js'; // Cambiado: restablecerPassword -> restablecerContrasena
import { auth } from '../middleware/auth.js';

const router = Router();

router.post('/registrar', registrar);
router.post('/login', login);


router.post("/olvide-contrasena", olvideContrasena);
router.post("/nueva-contrasena", nuevaContrasena);

router.get('/perfil', auth, getPerfil);
router.put('/perfil', auth, updatePerfil);
router.delete('/perfil', auth, desactivarPerfil);


export default router;