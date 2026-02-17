import { Router } from "express";
import { auth, esMiembroDeLaClase } from '../middleware/auth.js';
import { crearProyecto, getProyectosAlumno, getProyectosPorClase, updateProyecto, deleteProyecto, getProyectoById } from "../controllers/proyecto-controllers.js";
import { getProyectosPendientesAlumno } from "../controllers/entrega-controllers.js";

const router = Router();

/**
 * @swagger
 * /api/proyectos:
 *   post:
 *     summary: Crear un nuevo proyecto
 *     tags: [Proyectos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, descripcion, fechaEntrega, claseId, tipoProyecto]
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *               descripcion:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 200
 *               fechaEntrega:
 *                 type: string
 *                 format: date-time
 *               claseId:
 *                 type: string
 *               tipoProyecto:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *     responses:
 *       201:
 *         description: Proyecto creado con éxito
 *       400:
 *         description: Error de validación (nombre/descripción cortos, fecha pasada o falta tipoProyecto ID)
 *       403:
 *         description: No se puede crear porque la clase está archivada
 *       404:
 *         description: La clase especificada no existe
 *       500:
 *         description: Error al crear el proyecto
 */
router.post("/", auth, crearProyecto); 

/**
 * @swagger
 * /api/proyectos/mis-proyectos:
 *   get:
 *     summary: Obtener proyectos del alumno logueado
 *     tags: [Proyectos]
 *     responses:
 *       200:
 *         description: Lista de proyectos del alumno
 *       401:
 *         description: Usuario no autenticado
 *       500:
 *         description: Error al obtener proyectos
 */
router.get("/mis-proyectos", auth, getProyectosAlumno); 

/**
 * @swagger
 * /api/proyectos/clase/{claseId}:
 *   get:
 *     summary: Obtener proyectos de una clase específica
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: claseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de proyectos de la clase
 *       500:
 *         description: Error al obtener proyectos de la clase
 */
router.get("/clase/:claseId", auth, esMiembroDeLaClase, getProyectosPorClase);

/**
 * @swagger
 * /api/proyectos/pendientes:
 *   get:
 *     summary: Obtener proyectos pendientes de entrega del alumno
 *     tags: [Proyectos]
 *     responses:
 *       200:
 *         description: Proyectos que el alumno aún no entregó
 *       401:
 *         description: Usuario no autenticado
 */
router.get("/pendientes", auth, getProyectosPendientesAlumno);

/**
 * @swagger
 * /api/proyectos/{id}:
 *   get:
 *     summary: Obtener detalle de un proyecto por ID
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del proyecto
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         description: Error al obtener proyecto
 *   put:
 *     summary: Actualizar un proyecto
 *     tags: [Proyectos]
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
 *               descripcion:
 *                 type: string
 *               fechaEntrega:
 *                 type: string
 *     responses:
 *       200:
 *         description: Proyecto actualizado con éxito
 *       400:
 *         description: Validación fallida o el proyecto ya está cancelado
 *       403:
 *         description: No se puede modificar porque la clase está archivada
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         description: Error al actualizar
 *   delete:
 *     summary: Eliminar o cancelar un proyecto
 *     description: Si el proyecto tiene entregas, se marca como CANCELADO. Si no tiene, se elimina físicamente.
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto eliminado o cancelado exitosamente
 *       403:
 *         description: No se puede eliminar porque la clase está archivada
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         description: Error interno al procesar la solicitud
 */
router.delete("/:id", auth, deleteProyecto);

router.get("/:id", auth, getProyectoById);
router.put("/:id", auth, updateProyecto);

export default router;