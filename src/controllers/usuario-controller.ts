import { Request, Response, NextFunction, RequestHandler } from 'express';
import Usuario from '../model/usuario-model.js';
import jwt from 'jsonwebtoken';

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      res.status(401).json({ mensaje: 'Email invalido' });
      return;
    }

    const passwordValido = await usuario.compararPassword(password);
    if (!passwordValido) {
      res.status(401).json({ mensaje: 'Contraseña incorrecra' });
      return; 
    }
    
    const token = jwt.sign(
      { id: usuario._id },
      "clave-secreta",
      { expiresIn: "3h" }
    );


    // Si todo es correcto, envía una respuesta de éxito
    res.status(200).json({ mensaje: 'Inicio de sesion exitoso',token, usuario: {
      id: usuario._id,
      nombreCompleto: usuario.nombreCompleto,
      email: usuario.email
    }});
  } catch (error) {
    next(error); 
  }
};

export const registrar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    next(error); 
  }
};
