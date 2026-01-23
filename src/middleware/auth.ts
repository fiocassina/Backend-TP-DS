import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Clase from "../model/clase-model.js"; 
import Usuario from '../model/usuario-model.js';

interface RequestConUser extends Request {
  user?: { id: string; rol?: string; };
}

// 1. Verificar Token (Login)
export const auth = (req: RequestConUser, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    res.status(401).json({ mensaje: "Token requerido" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "clave-secreta") as JwtPayload;
    req.user = { id: decoded.id as string, rol: decoded.rol as string }; 
    next(); 
  } catch (err) {
    res.status(401).json({ mensaje: "Token inválido o expirado" });
    return;
  }
};

// 2. Verificar si es el Dueño (Para Borrar/Editar)
export const esProfeDeLaClase = async (req: RequestConUser, res: Response, next: NextFunction) => {
    const claseId = req.params.id; 
    const usuarioId = req.user?.id; 

    try {
        const clase = await Clase.findById(claseId);
        
        if (!clase) {
            return res.status(404).json({ mensaje: "Clase no encontrada" });
        }

        if (clase.profesorId.toString() === usuarioId) {
            next(); 
        } else {
            return res.status(403).json({ mensaje: "No tenés permiso para modificar esta clase. Solo el profesor titular puede hacerlo." });
        }
    } catch (error) {
        console.error("Error verificando permisos de clase:", error);
        return res.status(500).json({ mensaje: "Error verificando permisos de clase" });
    }
};

// 3. NUEVO: Verificar si es Miembro (Para Ver/Entrar)
// Deja pasar si sos el Profe O si sos un Alumno inscripto.
export const esMiembroDeLaClase = async (req: RequestConUser, res: Response, next: NextFunction) => {
    const claseId = req.params.id;
    const usuarioId = req.user?.id;

    try {
        const clase = await Clase.findById(claseId);

        if (!clase) {
            return res.status(404).json({ mensaje: "Clase no encontrada" });
        }

        // Chequeamos si es el Profe
        const esProfe = clase.profesorId.toString() === usuarioId;
        
        // Chequeamos si el ID del usuario está en el array de alumnos
        // (Usamos 'some' para buscar en la lista)
        const esAlumnoInscripto = clase.alumnos.some((alum: any) => alum.toString() === usuarioId);

        if (esProfe || esAlumnoInscripto) {
            next(); // Pasa, es miembro del club
        } else {
            // ACÁ ESTÁ EL REBOTE
            return res.status(403).json({ mensaje: "⛔ Acceso denegado: No estás inscripto en esta clase." });
        }

    } catch (error) {
        console.error("Error verificando membresía:", error);
        return res.status(500).json({ mensaje: "Error del servidor verificando acceso" });
    }
};