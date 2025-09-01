import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface RequestConUser extends Request {
  user?: { id: string };
}

export const auth = (req: RequestConUser, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ mensaje: "Token requerido" });

  try {
    const decoded = jwt.verify(token, "clave-secreta") as JwtPayload;
    req.user = { id: decoded.id as string }; // agregamos el id del usuario a la request
    next(); // pasamos al siguiente paso (la ruta real)
  } catch (err) {
    return res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
};
