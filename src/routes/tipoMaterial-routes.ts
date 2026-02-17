import { Router } from 'express';
import {
  getAllTiposMaterial,
  getTipoMaterialById,
} from '../controllers/tipoMaterial-controllers.js';

const router = Router();

/**
 * @swagger
 * /api/tipo-materiales:
 *   get:
 *     summary: Obtener todos los tipos de material
 *     description: Retorna la lista de categorías de materiales (ej. PDF, Video, Enlace).
 *     tags: [Tipos de Material]
 *     responses:
 *       200:
 *         description: Lista de tipos de material obtenida con éxito
 *       500:
 *         description: Error interno del servidor al obtener los tipos
 */
router.get('/', getAllTiposMaterial);

/**
 * @swagger
 * /api/tipo-materiales/{id}:
 *   get:
 *     summary: Obtener un tipo de material por ID
 *     tags: [Tipos de Material]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del tipo de material
 *     responses:
 *       200:
 *         description: Datos del tipo de material encontrados
 *       404:
 *         description: Tipo de material no encontrado
 *       500:
 *         description: Error interno del servidor al buscar por ID
 */
router.get('/:id', getTipoMaterialById);

export default router;