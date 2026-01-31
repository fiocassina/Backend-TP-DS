import { Router } from 'express';
import { auth } from '../middleware/auth.js'; 
import multer from 'multer';
import {
  getProyectosPendientesAlumno,
  crearEntrega,
  editarEntrega,
  eliminarEntrega,
  getEntregasPorProyecto,
  getEntregasPorAlumno,
  getEntregaPorId,
  getReporteAprobadas,
} from '../controllers/entrega-controllers.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const router = Router();
router.get('/pendientes', auth, getProyectosPendientesAlumno);
router.post('/', auth, upload.single('archivoUrl'), crearEntrega);
router.get('/proyecto/:proyectoId', auth, getEntregasPorProyecto);
router.get('/alumno/mis-entregas', auth, getEntregasPorAlumno);
router.get('/reporte-aprobadas', auth, getReporteAprobadas);
router.get('/:entregaId', auth, getEntregaPorId);
router.delete('/:id', auth, eliminarEntrega);
router.put('/:id', auth, upload.single('archivoUrl'), editarEntrega);

export default router;