import { Request, Response, NextFunction, RequestHandler } from 'express';
import Usuario from '../model/usuario-model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 
import transporter from "../config/mailer.js";

interface RequestConUser extends Request {
  user?: { id: string };
}

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Email inválido' });
    }

    if (!usuario.activo) {
      return res.status(403).json({ mensaje: 'Este usuario ha sido dado de baja.' });
    }

    const passwordValido = await usuario.compararPassword(password);
    if (!passwordValido) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol }, 
      process.env.JWT_SECRET || "clave-secreta", 
      { expiresIn: "3h" }
    );

    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombreCompleto: usuario.nombreCompleto,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    next(error);
  }
};

export const registrar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, ...restoDeDatos } = req.body;
    const usuarioExistente = await Usuario.findOne({ email });

    if (usuarioExistente) {
      return res.status(409).json({
        mensaje: 'El email ya ha sido registrado. Por favor, usa otro correo.'
      });
    }

    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save(); // El pre('save') del modelo encriptará la contraseña automáticamente

    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    next(error);
  }
};

export const getPerfil = async (req: RequestConUser, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ mensaje: 'Token inválido o no enviado' });
    }

    const usuario = await Usuario.findById(req.user.id).select('-password').lean();

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.set('Cache-Control', 'no-store');
    res.status(200).json(usuario);
  } catch (error) {
    console.error('Error en getPerfil:', error);
    res.status(500).json({ mensaje: 'Error interno al obtener perfil', error });
  }
};

export const updatePerfil = async (req: RequestConUser, res: Response) => {
  try {
    const { nombreCompleto, email } = req.body;
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.user?.id,
      { nombreCompleto, email },
      { new: true }
    ).select('-password');

    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.status(200).json({ mensaje: 'Perfil actualizado', usuario: usuarioActualizado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el perfil', error });
  }
};

export const desactivarPerfil = async (req: RequestConUser, res: Response) => {
  try {
    await Usuario.findByIdAndUpdate(req.user?.id, { activo: false });
    res.status(200).json({ mensaje: 'Usuario dado de baja correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al dar de baja el usuario', error });
  }
};

export const olvideContrasena = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ message: "No existe usuario con ese email" });
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    
    usuario.resetPasswordToken = codigo;
    usuario.resetPasswordExpires = new Date(Date.now() + 3600000); 
    await usuario.save();

    await transporter.sendMail({
      from: `"StudyRoom - Tu portal educativo" <${process.env.EMAIL_USER}>`, 
      to: usuario.email,
      subject: "Restablecer Contraseña - Código de Verificación",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Recuperación de Cuenta</h2>
            <p>Hola ${usuario.nombreCompleto},</p>
            <p>Usá el siguiente código para restablecer tu contraseña:</p>
            <h1 style="color: #0d6efd; letter-spacing: 5px; font-size: 32px;">${codigo}</h1>
            <p><small>Este código expira en 1 hora.</small></p>
        </div>
      `,
    });

    res.json({ message: "Código enviado al correo" });
  } catch (error) {
    console.error("Error envío mail:", error);
    res.status(500).json({ message: "Error al enviar el correo" });
  }
};

export const nuevaContrasena = async (req: Request, res: Response) => {
  const { email, codigo, nuevaPassword } = req.body;

  try {
    const usuario = await Usuario.findOne({
      email,
      resetPasswordToken: codigo,
      resetPasswordExpires: { $gt: Date.now() } 
    });

    if (!usuario) {
      return res.status(400).json({ message: "Código inválido o expirado" });
    }

    // El middleware .pre('save') en el model detecta el cambio y encripta la contraseña.
    usuario.password = nuevaPassword;

    // Limpiamos token
    usuario.resetPasswordToken = null;
    usuario.resetPasswordExpires = null;
    
    // Al hacer save(), se dispara el pre-save que hashea la contraseña
    await usuario.save();

    res.json({ message: "Contraseña cambiada con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al cambiar contraseña" });
  }
};