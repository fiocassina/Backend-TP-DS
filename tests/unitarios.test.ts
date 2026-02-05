// tests/unitarios.test.ts
import { esFechaFutura, esEmailValido, esNotaValida } from '../src/utils/validaciones';

describe('Pruebas Unitarias de Reglas de Negocio', () => {

    // --- INTEGRANTE 1: Validación de Fechas para Proyectos ---
    // Regla: Un profesor no puede crear una entrega con fecha pasada.
describe('Función: esFechaFutura', () => {
        test('Debe devolver TRUE para una fecha futura (mañana)', () => {
            const manana = new Date();
            manana.setDate(manana.getDate() + 1); // Sumamos 1 día
            expect(esFechaFutura(manana)).toBe(true);
        });

        test('Debe devolver TRUE para la fecha de HOY', () => {
            const hoy = new Date(); // Fecha actual
            expect(esFechaFutura(hoy)).toBe(true);
        });

        test('Debe devolver FALSE para una fecha pasada (ayer)', () => {
            const ayer = new Date();
            ayer.setDate(ayer.getDate() - 1); // Restamos 1 día
            expect(esFechaFutura(ayer)).toBe(false);
        });
    });

    // --- INTEGRANTE 2: Validación de Emails ---
    // Regla: El email debe tener formato de correo (x@x.x) para poder enviar notificaciones.
    describe('Validación de Formato de Email', () => {
        
        test('Debe aceptar un email completo (con arroba y punto)', () => {
            // Este es el caso correcto
            expect(esEmailValido('alumno@frro.utn.edu.ar')).toBe(true);
        });

        test('Debe rechazar texto que no parece un email (sin arroba)', () => {
            // Si el usuario pone solo su nombre, debe dar False
            expect(esEmailValido('juan_perez')).toBe(false);
        });
        
        test('Debe rechazar si falta el dominio (tiene arroba pero falta lo demas)', () => {
             // Validamos que sea un mail real, no solo un "@"
            expect(esEmailValido('juan@')).toBe(false);
        });
    });

    // --- INTEGRANTE 3: Validación de Notas ---
    // Regla: Las notas de corrección deben ser coherentes (1 al 10).
    describe('Validación de Rango de Notas', () => {
        
        test('Debe aceptar una nota dentro del rango (ej: 8)', () => {
            expect(esNotaValida(8)).toBe(true);
        });

        test('Debe rechazar notas negativas', () => {
            // Una nota -5 no existe, esperamos False
            expect(esNotaValida(-5)).toBe(false);
        });

        test('Debe rechazar notas mayores a 10', () => {
            // Una nota 11 no existe, esperamos False
            expect(esNotaValida(15)).toBe(false);
        });
    });

});