import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// Configuración de variables de entorno 
dotenv.config({ path: path.resolve(process.cwd(), 'variables.env') });

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser || !emailPass) {
  console.warn(' ADVERTENCIA: Faltan las variables de entorno del correo (EMAIL_USER o EMAIL_PASS). Los mails no saldrán.');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,            
  secure: false,        
  auth: {
    user: emailUser || '', 
    pass: emailPass || '',
  },
  tls: {
    rejectUnauthorized: false 
  }
});

transporter.verify()
  .then(() => {
    console.log('El servicio de correos está CONECTADO y listo.');
  })
  .catch((error) => {
    console.error('Error al conectar con Gmail:', error);
  });

export default transporter;