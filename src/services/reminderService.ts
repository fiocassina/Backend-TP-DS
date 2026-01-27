
import transporter from '../config/mailer.js';
import EntregaModel from '../model/entrega-model.js';
import ProyectoModel, { IProyecto } from '../model/proyecto-model.js';

import ClaseModel, { IClase } from '../model/clase-model.js';
import { IUsuario } from '../model/usuario-model.js';

const getTomorrowRange = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Inicio del día de mañana (00:00:00)
  const startOfTomorrow = new Date(tomorrow.setHours(0, 0, 0, 0));
  // Fin del día de mañana (23:59:59)
  const endOfTomorrow = new Date(tomorrow.setHours(23, 59, 59, 999));

  return { start: startOfTomorrow, end: endOfTomorrow };
};

// Definimos una interfaz para los objetos que guardaremos en la lista de envío
interface IReminderToSend {
  alumno: IUsuario;
  proyecto: IProyecto;
}


export const checkAndSendReminders = async () => {
  console.log(' Iniciando el chequeo diario de entregas próximas a vencer...');

  try {
    // 1. Obtenemos el rango de fechas de mañana
    const { start, end } = getTomorrowRange();
    console.log(` Buscando proyectos que venzan el día: ${start.toLocaleDateString()}`);


    const proyectosVencenManana = await ProyectoModel.find({
      fechaEntrega: { $gte: start, $lte: end }
    }).populate({
      path: 'clase', // Populamos la clase del proyecto
      populate: {
        path: 'alumnos' // Y dentro de la clase, populamos el array de alumnos
      }
    });

    console.log(` Se encontraron ${proyectosVencenManana.length} proyectos que vencen mañana.`);

    // Lista donde guardaremos a quiénes hay que mandar mail
    const remindersToSend: IReminderToSend[] = [];


    for (const proyectoDoc of proyectosVencenManana) {
      const proyecto = proyectoDoc as unknown as IProyecto;

      const clase = proyectoDoc.clase as unknown as IClase;
      const alumnosInscritos = clase.alumnos as unknown as IUsuario[];

      console.log(`   Verificando proyecto "${proyecto.nombre}" en clase con ${alumnosInscritos.length} alumnos.`);


      for (const alumno of alumnosInscritos) {

        const yaEntrego = await EntregaModel.exists({
          proyecto: proyecto._id,
          alumno: alumno._id
        });

        if (!yaEntrego) {

          console.log(`       Alumno ${alumno.email} aún NO ha entregado. Agregando a lista.`);
          remindersToSend.push({ alumno, proyecto });
        } else {
        
        }
      }
    }


    console.log(` Total de recordatorios a enviar hoy: ${remindersToSend.length}`);

    if (remindersToSend.length === 0) {
        console.log(' Todos los alumnos están al día. No hay correos que enviar.');
        return;
    }

    // 4. BUCLE DE ENVÍO DE CORREOS (Igual que antes)
    console.log(' Iniciando el envío de correos...');

    for (const reminder of remindersToSend) {
      const { alumno, proyecto } = reminder;

      console.log(`Enviando recordatorio a: ${alumno.email} por el proyecto: "${proyecto.nombre}"`);

      const mailOptions = {
        from: '"Campus Virtual DSW" <' + process.env.EMAIL_USER + '>',
        to: alumno.email,
        subject: ` Recordatorio: Tu entrega de "${proyecto.nombre}" vence mañana`,
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
            <h2 style="color: #0056b3;">Hola, ${alumno.nombreCompleto}.</h2>
            <p>Te recordamos que tienes una entrega pendiente que vence muy pronto.</p>

            <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #856404;">Proyecto: ${proyecto.nombre}</h3>
              <p style="margin-bottom: 0; color: #856404;"><strong>Fecha límite:</strong> Mañana, ${new Date(proyecto.fechaEntrega).toLocaleDateString()}</p>
            </div>

            <p>Nuestros registros indican que <strong>aún no has realizado el envío</strong> de este trabajo.</p>
            <p>Por favor, asegúrate de subir tu trabajo a la plataforma antes de la fecha límite.</p>
            <p>¡Mucho éxito!</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;">
            <small style="color: #777;">Este es un aviso automático del sistema. Si ya entregaste tu trabajo en los últimos minutos, por favor desestima este correo.</small>
          </div>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(` Correo enviado OK a ${alumno.email}`);
      } catch (error) {
        console.error(` ERROR al enviar correo a ${alumno.email}:`, error);
      }
    }

    console.log('Proceso de recordatorios finalizado por hoy.');

  } catch (error) {
    console.error('ERROR  en el servicio de recordatorios:', error);
  }
};