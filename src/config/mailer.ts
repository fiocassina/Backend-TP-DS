
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


dotenv.config();


const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser || !emailPass) {
  console.error('Faltan las variables EMAIL_USER o EMAIL_PASS en el archivo .env');
  process.exit(1); 
}

// Creamos el objeto "transporter" con tipos de TypeScript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

// Verificamos la conexión
transporter.verify((error, success) => {
  if (error) {
    console.error('Error al conectar con el servicio de correos:', error);
  } else {
    console.log('El servicio de correos está listo y conectado para enviar mensajes.');
  }
});

export default transporter;