import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'variables.env') });

console.log('Configurando Nodemailer para:', process.env.EMAIL_USER);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
} as any);

// Verificación rápida
transporter.verify()
  .then(() => {
    console.log('¡CONECTADO! Gmail aceptó la conexión.');
  })
  .catch((error) => {
    console.error(' Error de conexión:', error);
  });

export default transporter;