import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Clase from "../model/clase-model.js"; 

interface RequestConUser extends Request {
  user?: { id: string };
}

export const auth = (req: RequestConUser, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    res.status(401).json({ mensaje: "Token requerido" });
    return;
  }

  try {
    const decoded = jwt.verify(token, "clave-secreta") as JwtPayload;
    req.user = { id: decoded.id as string }; 
    next(); 
  } catch (err) {
    res.status(401).json({ mensaje: "Token inválido o expirado" });
    return;
  }
};


export const checkRole = (requiredRole: string) => {
    return async (req: RequestConUser, res: Response, next: NextFunction) => {
        if (!req.user || !req.user.id) {
            return res.status(403).json({ mensaje: "Acceso denegado. Usuario no autenticado." });
        }

        if (requiredRole !== 'profesor') {
             return res.status(403).json({ mensaje: "Acceso denegado. Rol no compatible con esta verificación." });
        }

        try {
            const esProfesor = await Clase.findOne({ profesorId: req.user.id });

            if (!esProfesor) {
                return res.status(403).json({ mensaje: "Acceso denegado. Solo profesores pueden acceder a este recurso." });
            }
            next();

        } catch (error) {
            console.error("Error al verificar el rol del profesor en la DB:", error);
            return res.status(500).json({ mensaje: "Error interno al verificar permisos." });
        }
    };
};
