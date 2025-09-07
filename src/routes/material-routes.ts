// src/routes/material-routes.ts
import { Router } from 'express';
import {
  getAllMateriales,
  getMaterialById,
  getMaterialesPorClase,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from '../controllers/material-controllers.js';

const router = Router();

// Listar todos los materiales
router.get('/', getAllMateriales);

// Obtener material por ID
router.get('/:id', getMaterialById);

// Obtener materiales de una clase
router.get('/clase/:claseId', getMaterialesPorClase);

// Crear material
router.post('/', createMaterial);

// Actualizar material
router.put('/:id', updateMaterial);
router.patch('/:id', updateMaterial);

// Eliminar material
router.delete('/:id', deleteMaterial);

export default router;
