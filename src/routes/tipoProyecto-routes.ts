import { Router } from "express"; 
import {
  getAllTiposProyecto,
  getTipoProyectoById,
  createTipoProyecto,
  updateTipoProyecto,
  deleteTipoProyecto, 
} from "../controllers/tipoProyecto-controllers.js";

const router = Router();

/**
 * @swagger
 * /api/tipo-proyectos:
 *   get:
 *     summary: Obtener todos los tipos de proyecto
 *     tags: [Tipos de Proyecto]
 *     responses:
 *       200:
 *         description: Lista de tipos de proyecto obtenida con éxito
 *       500:
 *         description: Error interno al obtener tipos de proyecto
 *   post:
 *     summary: Crear un nuevo tipo de proyecto
 *     tags: [Tipos de Proyecto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, descripcion]
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *               descripcion:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 200
 *     responses:
 *       201:
 *         description: Tipo de proyecto creado
 *       400:
 *         description: Nombre o descripción faltantes o con longitud inválida
 *       409:
 *         description: Ya existe un tipo de proyecto con ese nombre
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', getAllTiposProyecto);
router.post('/', createTipoProyecto);

/**
 * @swagger
 * /api/tipo-proyectos/{id}:
 *   get:
 *     summary: Obtener tipo de proyecto por ID
 *     tags: [Tipos de Proyecto]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del tipo de proyecto
 *       404:
 *         description: Tipo de proyecto no encontrado
 *       500:
 *         description: Error interno al obtener el tipo por ID
 *   put:
 *     summary: Actualizar un tipo de proyecto
 *     tags: [Tipos de Proyecto]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tipo de proyecto actualizado
 *       400:
 *         description: Nombre o descripción con longitud inválida
 *       404:
 *         description: Tipo de proyecto no encontrado
 *       500:
 *         description: Error interno al actualizar
 *   delete:
 *     summary: Eliminar un tipo de proyecto
 *     tags: [Tipos de Proyecto]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tipo de proyecto eliminado correctamente
 *       404:
 *         description: Tipo de proyecto no encontrado
 *       500:
 *         description: Error interno al eliminar
 */
router.get('/:id', getTipoProyectoById);
router.put('/:id', updateTipoProyecto);
router.delete('/:id', deleteTipoProyecto);

export default router;