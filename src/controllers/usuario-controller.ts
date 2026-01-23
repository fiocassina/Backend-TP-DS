import { Request, Response, NextFunction, RequestHandler } from 'express';
import Usuario from '../model/usuario-model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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
    await nuevoUsuario.save();


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


export const restablecerContrasena = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, contrasenaActual, contrasenaNueva } = req.body; 

    if (!email || !contrasenaActual || !contrasenaNueva) {
      return res.status(400).json({ mensaje: 'Todos los campos son requeridos.' });
    }

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'El email no está registrado.' });
    }

    const esCorrecta = await bcrypt.compare(contrasenaActual, usuario.password);

    if (!esCorrecta) {
      return res.status(401).json({ mensaje: 'La contraseña actual es incorrecta.' });
    }
    
    usuario.password = contrasenaNueva; 
    await usuario.save();

    res.status(200).json({ mensaje: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.' });

  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    next(error);
  }
};