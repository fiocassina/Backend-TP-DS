
import { esFechaFutura, esEmailValido, esNotaValida } from '../src/utils/validaciones';

describe('Pruebas Unitarias de Reglas de Negocio', () => {


describe('Función: esFechaFutura', () => {
        test('Debe devolver TRUE para una fecha futura (mañana)', () => {
            const manana = new Date();
            manana.setDate(manana.getDate() + 1); 
            expect(esFechaFutura(manana)).toBe(true);
        });

        test('Debe devolver TRUE para la fecha de HOY', () => {
            const hoy = new Date(); 
            expect(esFechaFutura(hoy)).toBe(true);
        });

        test('Debe devolver FALSE para una fecha pasada (ayer)', () => {
            const ayer = new Date();
            ayer.setDate(ayer.getDate() - 1);
            expect(esFechaFutura(ayer)).toBe(false);
        });
    });

    
    describe('Validación de Formato de Email', () => {
        
        test('Debe aceptar un email completo (con arroba y punto)', () => {
   
            expect(esEmailValido('alumno@frro.utn.edu.ar')).toBe(true);
        });

        test('Debe rechazar texto que no parece un email (sin arroba)', () => {
  
            expect(esEmailValido('juan_perez')).toBe(false);
        });
        
        test('Debe rechazar si falta el dominio (tiene arroba pero falta lo demas)', () => {
         
            expect(esEmailValido('juan@')).toBe(false);
        });
    });

  
    describe('Validación de Rango de Notas', () => {
        
        test('Debe aceptar una nota dentro del rango (ej: 8)', () => {
            expect(esNotaValida(8)).toBe(true);
        });

        test('Debe rechazar notas negativas', () => {

            expect(esNotaValida(-5)).toBe(false);
        });

        test('Debe rechazar notas mayores a 10', () => {
            expect(esNotaValida(15)).toBe(false);
        });
    });

});