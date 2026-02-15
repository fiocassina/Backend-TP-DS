import app from './app.js'
import cron from 'node-cron';
import { checkAndSendReminders } from './services/reminderService.js';

cron.schedule('0 9 * * *', async () => {
  console.log('Son las 9:00 AM. Ejecutando tarea programada de recordatorios...');
  try {
    await checkAndSendReminders();
  } catch (error) {
    console.error('Error al ejecutar la tarea programada:', error);
  }
});

console.log('Sistema de recordatorios automáticos programado para las 09:00 AM diariamente.');

// para probarlo ahora
//checkAndSendReminders();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})