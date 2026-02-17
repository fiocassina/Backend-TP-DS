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


/**
 * @swagger
 * /api/entregas/pendientes:
 *   get:
 *     summary: Obtener proyectos pendientes de entrega para el alumno
 *     tags: [Entregas]
 *     responses:
 *       200:
 *         description: Lista de proyectos que el alumno aún no entregó y no vencieron
 *       401:
 *         description: Usuario no autenticado
 *       500:
 *         description: Error al obtener proyectos pendientes
 */
router.get('/pendientes', auth, getProyectosPendientesAlumno);

/**
 * @swagger
 * /api/entregas:
 *   post:
 *     summary: Crear una nueva entrega
 *     tags: [Entregas]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               proyectoId:
 *                 type: string
 *               comentario:
 *                 type: string
 *               archivoUrl:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Entrega creada con éxito
 *       400:
 *         description: Error de validación (ID inválido, comentario largo, proyecto cancelado o ya entregado)
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: La clase está archivada
 *       404:
 *         description: El proyecto no existe
 *       500:
 *         description: Error interno al crear la entrega
 */
router.post('/', auth, upload.single('archivoUrl'), crearEntrega);

/**
 * @swagger
 * /api/entregas/proyecto/{proyectoId}:
 *   get:
 *     summary: Obtener entregas de un proyecto específico
 *     tags: [Entregas]
 *     parameters:
 *       - in: path
 *         name: proyectoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de entregas (opcionalmente wrappeada en data si query wrap=true)
 *       400:
 *         description: ID de proyecto faltante o inválido
 *       500:
 *         description: Error al obtener las entregas
 */
router.get('/proyecto/:proyectoId', auth, getEntregasPorProyecto);

/**
 * @swagger
 * /api/entregas/alumno/mis-entregas:
 *   get:
 *     summary: Obtener todas las entregas del alumno logueado
 *     tags: [Entregas]
 *     responses:
 *       200:
 *         description: Lista de entregas del alumno con su estado
 *       401:
 *         description: Usuario no autenticado
 *       500:
 *         description: Error al obtener entregas
 */
router.get('/alumno/mis-entregas', auth, getEntregasPorAlumno);

/**
 * @swagger
 * /api/entregas/reporte-aprobadas:
 *   get:
 *     summary: Reporte de alumnos con entregas aprobadas
 *     tags: [Entregas]
 *     parameters:
 *       - in: query
 *         name: proyectoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del reporte (id, proyecto, alumno, nota, fechas)
 *       400:
 *         description: proyectoId faltante o inválido
 *       500:
 *         description: Error interno del servidor
 */
router.get('/reporte-aprobadas', auth, getReporteAprobadas);

/**
 * @swagger
 * /api/entregas/{entregaId}:
 *   get:
 *     summary: Obtener detalle de una entrega por ID
 *     tags: [Entregas]
 *     parameters:
 *       - in: path
 *         name: entregaId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle de la entrega
 *       400:
 *         description: ID de entrega inválido o faltante
 *       404:
 *         description: Entrega no encontrada
 *       500:
 *         description: Error al obtener la entrega
 */
router.get('/:entregaId', auth, getEntregaPorId);

/**
 * @swagger
 * /api/entregas/{id}:
 *   delete:
 *     summary: Eliminar una entrega
 *     tags: [Entregas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Entrega eliminada con éxito
 *       400:
 *         description: No se puede eliminar (clase archivada o proyecto cancelado)
 *       403:
 *         description: No tienes permiso para eliminar esta entrega
 *       404:
 *         description: Entrega no encontrada
 *       500:
 *         description: Error al eliminar
 */
router.delete('/:id', auth, eliminarEntrega);

/**
 * @swagger
 * /api/entregas/{id}:
 *   put:
 *     summary: Editar una entrega existente
 *     tags: [Entregas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               comentario:
 *                 type: string
 *               archivoUrl:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Entrega actualizada con éxito
 *       400:
 *         description: Error de validación, clase archivada o proyecto cancelado
 *       404:
 *         description: Entrega no encontrada
 *       500:
 *         description: Error interno al editar
 */
router.put('/:id', auth, upload.single('archivoUrl'), editarEntrega);

export default router;