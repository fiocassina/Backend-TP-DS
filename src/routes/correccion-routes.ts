import { Router } from "express";
import * as correccionController from "../controllers/correccion-controller.js";

const router = Router();

// Quitamos el bloque de tags de arriba para evitar errores de compilación

/**
 * @swagger
 * /api/correcciones:
 *   post:
 *     summary: Crear una nueva corrección
 *     tags: [Correcciones]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Correccion'
 *     responses:
 *       201:
 *         description: Corrección creada con éxito
 *       400:
 *         description: Faltan datos (entrega/nota) o la nota no es válida (debe ser 1-10)
 *       500:
 *         description: Error interno al crear la corrección
 */
router.post("/", correccionController.crearCorreccion);

/**
 * @swagger
 * /api/correcciones/entrega/{entregaId}:
 *   get:
 *     summary: Obtener correcciones de una entrega específica
 *     tags: [Correcciones]
 *     parameters:
 *       - in: path
 *         name: entregaId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de correcciones obtenida
 *       500:
 *         description: Error al obtener las correcciones
 */
router.get("/entrega/:entregaId", correccionController.getCorreccionesPorEntrega);

/**
 * @swagger
 * /api/correcciones:
 *   get:
 *     summary: Obtener todas las correcciones
 *     tags: [Correcciones]
 *     responses:
 *       200:
 *         description: Lista completa de todas las correcciones
 *       500:
 *         description: Error al obtener las correcciones
 */
router.get("/", correccionController.getTodasCorrecciones);

/**
 * @swagger
 * /api/correcciones/{id}:
 *   put:
 *     summary: Actualizar una corrección por ID
 *     tags: [Correcciones]
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
 *               nota:
 *                 type: number
 *               comentario:
 *                 type: string
 *     responses:
 *       200:
 *         description: Corrección actualizada correctamente
 *       400:
 *         description: Falta la nota o la nota es inválida (debe ser 1-10)
 *       500:
 *         description: Error al actualizar la corrección
 */
router.put("/:id", correccionController.actualizarCorreccion); 

/**
 * @swagger
 * /api/correcciones/{id}:
 *   delete:
 *     summary: Eliminar una corrección
 *     tags: [Correcciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Corrección eliminada con éxito
 *       404:
 *         description: Corrección no encontrada
 *       500:
 *         description: Error al eliminar la corrección
 */
router.delete("/:id", correccionController.eliminarCorreccion);

export default router;