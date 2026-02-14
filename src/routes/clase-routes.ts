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
 *     summary: Obtener mis clases
 *     tags: [Clases]
 *     responses:
 *       200:
 *         description: Lista de clases del usuario (profesor o alumno).
 *   post:
 *     summary: Crear una nueva clase
 *     tags: [Clases]
 *     responses:
 *       201:
 *         description: Clase creada.
 */
router.get('/', auth, getMisClases);
router.post('/', auth, createClase); 


/**
 * @swagger
 * /api/clases/archivadas:
 *   get:
 *     summary: Listar clases archivadas
 *     tags: [Clases]
 *     responses:
 *       200:
 *         description: Lista de clases archivadas.
 */
router.get('/archivadas', auth, getClasesArchivadas);

/**
 * @swagger
 * /api/clases/verificar-alumno:
 *   get:
 *     summary: Verificar si el usuario es alumno
 *     tags: [Clases]
 *     responses:
 *       200:
 *         description: Confirmación de rol.
 */
router.get('/verificar-alumno', auth, checkSoyAlumno);

/**
 * @swagger
 * /api/clases/{id}:
 *   get:
 *     summary: Obtener detalle de una clase
 *     tags: [Clases]
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema: { type: string }
 *     responses:
 *       200:
 *         description: Datos de la clase.
 *   put:
 *     summary: Actualizar clase
 *     tags: [Clases]
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema: { type: string }
 *     responses:
 *       200:
 *         description: Clase actualizada.
 *   patch:
 *     summary: Actualizar clase (modificación parcial)
 *     tags: [Clases]
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema: { type: string }
 *     responses:
 *       200:
 *         description: Clase actualizada parcialmente.
 *   delete:
 *     summary: Eliminar clase
 *     tags: [Clases]
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema: { type: string }
 *     responses:
 *       200:
 *         description: Clase eliminada.
 */
router.get('/:id', auth, esMiembroDeLaClase, getClaseById); 
router.put('/:id', auth, esProfeDeLaClase, updateClase); 
router.patch('/:id', auth, esProfeDeLaClase, updateClase); 
router.delete('/:id', auth, esProfeDeLaClase, deleteClase);

/**
 * @swagger
 * /api/clases/{id}/alumnos/{alumnoId}:
 *   delete:
 *     summary: Expulsar un alumno (Solo profesores)
 *     tags: [Clases]
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *     - in: path
 *       name: alumnoId
 *       required: true
 *     responses:
 *       200:
 *         description: Alumno expulsado.
 *       403:
 *         description: No se puede expulsar (Clase archivada).
 */
router.delete('/:id/alumnos/:alumnoId', auth, esProfeDeLaClase, expulsarAlumno);

/**
 * @swagger
 * /api/clases/inscribir:
 *   post:
 *     summary: Inscribirse a una clase (Solo alumnos)
 *     tags: [Clases]
 *     responses:
 *       200:
 *         description: Inscripción exitosa.
 */
router.post('/inscribir', auth, inscribirAlumno); 

/**
 * @swagger
 * /api/clases/{id}/salir:
 *   delete:
 *     summary: Abandonar una clase
 *     tags: [Clases]
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *     responses:
 *       200:
 *         description: Saliste de la clase.
 */
router.delete('/:id/salir', auth, salirDeClase);


export default router;