import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'variables.env') });

console.log('Intentando conectar con:', process.env.EMAIL_USER);

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  family: 4 
} as any); 

// Verificación 
transporter.verify()
  .then(() => {
    console.log('Nodemailer conectado correctamente con Gmail.');
  })
  .catch((error) => {
    console.error('Error al conectar Nodemailer:', error);
  });

export default transporter;