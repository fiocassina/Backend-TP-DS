import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'variables.env') });

const RESEND_API_KEY = process.env.EMAIL_PASS;

console.log('🔧 Configurando servicio de mail vía HTTP (Anti-Bloqueo Railway)...');

const transporter = {
  verify: async () => {
    if (!RESEND_API_KEY) {
      console.error('ERROR CRÍTICO: No hay API Key de Resend en EMAIL_PASS');
      return;
    }
    console.log('Servicio de Mail HTTP listo para usar.');
    return true;
  },

  sendMail: async (mailOptions: any) => {
    // Como es cuenta gratis, forzamos que el mail llegue SIEMPRE a la dueña de la cuenta
    // para evitar el error 403 "Forbidden" de Resend. Para pruebas reales, el destinatario debería ser alumno.email, pero eso no es posible con la versión gratuita de Resend.
    const emailDueño = process.env.EMAIL_USER; 
    
    const destinoSeguro = emailDueño || 'candegarciamo@gmail.com'; 

    console.log(`📤 Enviando mail vía HTTP a: ${destinoSeguro} (Originalmente para: ${mailOptions.to})`);

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev', //por version gratuita, el remitente debe ser uno permitido por Resend
          to: destinoSeguro,             
          subject: mailOptions.subject,
          html: `
            <div style="background: #fdf2ce; padding: 10px; border: 1px dashed orange; margin-bottom: 20px;">
              <strong>MODO PRUEBA:</strong> Este correo era para: ${mailOptions.to}
            </div>
            ${mailOptions.html}
          `
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error de Resend:', errorData);
        throw new Error(JSON.stringify(errorData));
      }

      const data = await response.json();
      console.log(' Mail enviado con éxito via HTTP! ID:', data.id);
      return data;

    } catch (error) {
      console.error('Falló el envío HTTP:', error);
      throw error;
    }
  }
};

export default transporter;