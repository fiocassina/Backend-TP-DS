import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'variables.env') });

console.log('Configurando transporte de correos...');

const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com', // <--- CAMBIO CLAVE: Usamos el servidor de Resend
  port: 465,
  secure: true,
  auth: {
    user: 'resend',           
    pass: process.env.EMAIL_PASS, 
  },
} as any);

transporter.verify()
  .then(() => {
    console.log('✅ Conexión EXITOSA con Resend.');
  })
  .catch((error) => {
    console.error('❌ Error al conectar con Resend:', error);
  });

export default transporter;