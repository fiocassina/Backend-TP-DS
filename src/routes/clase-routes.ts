import { Router } from 'express';
import { auth, esProfeDeLaClase, esMiembroDeLaClase } from '../middleware/auth.js'; 
import {
  getMisClases,
  getClasesArchivadas,
  getClaseById,
  createClase,
  updateClase,
  deleteClase,
  inscribirAlumno,
  expulsarAlumno,
  checkSoyAlumno,
  salirDeClase
} from '../controllers/clase-controllers.js';

const router = Router();

/**
 * @swagger
 * /api/clases:
 *   get:
 *     summary: Obtener mis clases (como profesor y como alumno)
 *     tags: [Clases]
 *     responses:
 *       200:
 *         description: Listado de clases activas separadas por rol
 *       401:
 *         description: Usuario no autenticado
 *       500:
 *         description: Error al obtener las clases
 *   post:
 *     summary: Crear una nueva clase
 *     tags: [Clases]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, materia]
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 3
 *               materia:
 *                 type: string
 *     responses:
 *       201:
 *         description: Clase creada con éxito
 *       400:
 *         description: Nombre inválido, faltan datos o nombre de clase duplicado para el profesor
 *       401:
 *         description: Usuario no autenticado
 *       500:
 *         description: Error interno al crear la clase
 */
router.get('/', auth, getMisClases);
router.post('/', auth, createClase); 

/**
 * @swagger
 * /api/clases/archivadas:
 *   get:
 *     summary: Listar clases archivadas del usuario
 *     tags: [Clases]
 *     responses:
 *       200:
 *         description: Listado de clases archivadas (profe/alumno)
 *       401:
 *         description: Usuario no autenticado
 *       500:
 *         description: Error al obtener clases archivadas
 */
router.get('/archivadas', auth, getClasesArchivadas);

/**
 * @swagger
 * /api/clases/verificar-alumno:
 *   get:
 *     summary: Verificar si el usuario tiene al menos una clase como alumno
 *     tags: [Clases]
 *     responses:
 *       200:
 *         description: Objeto con booleano esAlumno
 *       500:
 *         description: Error al verificar rol
 */
router.get('/verificar-alumno', auth, checkSoyAlumno);

/**
 * @swagger
 * /api/clases/inscribir:
 *   post:
 *     summary: Inscribirse a una clase mediante clave
 *     tags: [Clases]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clave:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inscripción exitosa
 *       400:
 *         description: Falta clave o el alumno ya está inscrito
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Clase archivada o el usuario es el profesor titular
 *       404:
 *         description: Clase no encontrada
 *       500:
 *         description: Error al inscribir
 */
router.post('/inscribir', auth, inscribirAlumno); 

/**
 * @swagger
 * /api/clases/{id}:
 *   get:
 *     summary: Detalle de una clase por ID
 *     tags: [Clases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos detallados de la clase y sus alumnos
 *       404:
 *         description: Clase no encontrada
 *       500:
 *         description: Error interno del servidor
 *   put:
 *     summary: Actualizar datos de la clase
 *     tags: [Clases]
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
 *         description: Clase actualizada exitosamente
 *       400:
 *         description: Nombre inválido (menos de 3 caracteres)
 *       404:
 *         description: Clase no encontrada
 *       500:
 *         description: Error al actualizar
 *   patch:
 *     summary: Actualizar datos parciales de la clase
 *     tags: [Clases]
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
 *               materia:
 *                type: string
 *     responses:
 *       200:
 *         description: Clase actualizada parcialmente
 *       400:
 *         description: Error en los datos enviados
 *       404:
 *         description: Clase no encontrada
 *   delete:
 *     summary: Archivar una clase (Baja lógica)
 *     tags: [Clases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Clase archivada correctamente
 *       404:
 *         description: Clase no encontrada
 *       500:
 *         description: Error al archivar
 */
router.get('/:id', auth, esMiembroDeLaClase, getClaseById); 
router.put('/:id', auth, esProfeDeLaClase, updateClase); 
router.patch('/:id', auth, esProfeDeLaClase, updateClase); 
router.delete('/:id', auth, esProfeDeLaClase, deleteClase);

/**
 * @swagger
 * /api/clases/{id}/alumnos/{alumnoId}:
 *   delete:
 *     summary: Expulsar un alumno de la clase
 *     tags: [Clases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *       - in: path
 *         name: alumnoId
 *         required: true
 *     responses:
 *       200:
 *         description: Alumno expulsado correctamente
 *       403:
 *         description: Clase archivada o no tienes permiso (no eres el profe)
 *       404:
 *         description: Clase no encontrada
 *       500:
 *         description: Error al eliminar alumno
 */
router.delete('/:id/alumnos/:alumnoId', auth, esProfeDeLaClase, expulsarAlumno);

/**
 * @swagger
 * /api/clases/{id}/salir:
 *   delete:
 *     summary: Darse de baja de una clase
 *     tags: [Clases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Baja exitosa de la clase
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: El profesor no puede darse de baja de su propia clase
 *       404:
 *         description: Clase no encontrada
 *       500:
 *         description: Error al intentar salir
 */
router.delete('/:id/salir', auth, salirDeClase);

export default router;