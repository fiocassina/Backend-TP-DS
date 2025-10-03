import { Router } from 'express';
import {
  getAllMateriales,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  getMaterialesPorClase,
} from '../controllers/material-controllers.js';
import multer from 'multer';

// Configuración de Multer para guardar archivos en la carpeta 'uploads'
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

router.get('/', getAllMateriales);
router.get('/:id', getMaterialById);
router.get('/clase/:claseId', getMaterialesPorClase);
router.post('/', upload.single('file'), createMaterial); 
router.put('/:id', updateMaterial);
router.delete('/:id', deleteMaterial);

export default router;