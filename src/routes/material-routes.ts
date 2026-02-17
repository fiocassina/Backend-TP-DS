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

/**
 * @swagger
 * /api/material:
 *   get:
 *     summary: Obtener todos los materiales
 *     tags: [Materiales]
 *     responses:
 *       200:
 *         description: Lista de todos los materiales registrados
 *       500:
 *         description: Error interno al obtener materiales
 *   post:
 *     summary: Crear un nuevo material (Archivo o URL)
 *     tags: [Materiales]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [nombre, tipoId, claseId]
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *               tipoId:
 *                 type: string
 *               claseId:
 *                 type: string
 *               url:
 *                 type: string
 *                 description: URL externa si no se sube archivo
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo físico del material
 *     responses:
 *       201:
 *         description: Material creado con éxito
 *       400:
 *         description: Error de validación, falta archivo/URL o material duplicado en la clase
 *       500:
 *         description: Error interno al crear material
 */
router.get('/', getAllMateriales);
router.post('/', upload.single('file'), createMaterial);

/**
 * @swagger
 * /api/material/{id}:
 *   get:
 *     summary: Obtener material por ID
 *     tags: [Materiales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del material
 *       404:
 *         description: Material no encontrado
 *       500:
 *         description: Error interno al obtener material
 *   put:
 *     summary: Actualizar material existente
 *     tags: [Materiales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Material actualizado
 *       400:
 *         description: Nombre inválido
 *       404:
 *         description: Material no encontrado
 *       500:
 *         description: Error interno al actualizar
 *   delete:
 *     summary: Eliminar material
 *     tags: [Materiales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Material eliminado con éxito
 *       404:
 *         description: Material no encontrado
 *       500:
 *         description: Error interno al eliminar
 */
router.get('/:id', getMaterialById);
router.put('/:id', updateMaterial);
router.delete('/:id', deleteMaterial);

/**
 * @swagger
 * /api/material/clase/{claseId}:
 *   get:
 *     summary: Obtener todos los materiales de una clase específica
 *     tags: [Materiales]
 *     parameters:
 *       - in: path
 *         name: claseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de materiales de la clase
 *       500:
 *         description: Error interno al obtener materiales por clase
 */
router.get('/clase/:claseId', getMaterialesPorClase);

export default router;