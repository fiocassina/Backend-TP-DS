import { Router } from 'express';
import { registrar, login, getPerfil, updatePerfil, desactivarPerfil, olvideContrasena, nuevaContrasena, cambiarPasswordAutenticado } from '../controllers/usuario-controller.js';
import { auth } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /api/usuarios/registrar:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, nombreCompleto, password]
 *             properties:
 *               email:
 *                 type: string
 *               nombreCompleto:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Formato de email, nombre o password (min 6 caracteres, 1 mayúscula, 1 número) inválido
 *       409:
 *         description: El email ya está registrado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/registrar', registrar);

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso, devuelve el token JWT
 *       400:
 *         description: Faltan credenciales
 *       401:
 *         description: Email inválido o contraseña incorrecta
 *       403:
 *         description: El usuario ha sido dado de baja (activo=false)
 *       500:
 *         description: Error interno del servidor
 */
router.post('/login', login);

/**
 * @swagger
 * /api/usuarios/olvide-contrasena:
 *   post:
 *     summary: Solicitar código de recuperación de contraseña
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Código enviado al correo
 *       404:
 *         description: No existe usuario con ese email
 *       500:
 *         description: Error al enviar el correo
 */
router.post("/olvide-contrasena", olvideContrasena);

/**
 * @swagger
 * /api/usuarios/nueva-contrasena:
 *   post:
 *     summary: Restablecer contraseña con el código enviado por mail
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               codigo:
 *                 type: string
 *               nuevaPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña cambiada con éxito
 *       400:
 *         description: Código inválido/expirado o contraseña débil
 *       500:
 *         description: Error al cambiar contraseña
 */
router.post("/nueva-contrasena", nuevaContrasena);

/**
 * @swagger
 * /api/usuarios/perfil:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Datos del perfil del usuario
 *       401:
 *         description: Token inválido o no enviado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al obtener perfil
 *   put:
 *     summary: Actualizar perfil del usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreCompleto:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
 *       400:
 *         description: Formato de email o nombre inválido
 *       404:
 *         description: Usuario no encontrado
 *       409:
 *         description: El email ya está en uso por otro usuario
 *       500:
 *         description: Error al actualizar
 *   delete:
 *     summary: Dar de baja el perfil (desactivar)
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Usuario dado de baja correctamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al procesar la baja
 */
router.get('/perfil', auth, getPerfil);
router.put('/perfil', auth, updatePerfil);
router.delete('/perfil', auth, desactivarPerfil);

/**
 * @swagger
 * /api/usuarios/cambiar-password-autenticado:
 *   put:
 *     summary: Cambiar contraseña estando logueado
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada con éxito
 *       400:
 *         description: Nueva contraseña débil
 *       422:
 *         description: La contraseña actual es incorrecta
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno
 */
router.put('/cambiar-password-autenticado', auth, cambiarPasswordAutenticado);

export default router;