export const esFechaFutura = (fecha: Date): boolean => {
    const hoy = new Date();
    // Comparamos los milisegundos de la fecha
    return fecha.getTime() > hoy.getTime();
};

export const esEmailValido = (email: string): boolean => {
    // Regex simple para validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const esNotaValida = (nota: number): boolean => {
    // La nota debe ser mayor o igual a 1 y menor o igual a 10
    return nota >= 1 && nota <= 10;
};