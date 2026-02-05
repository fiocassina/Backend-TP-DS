export const esFechaFutura = (fecha: Date): boolean => {
    const hoy = new Date();
    // "Reseteamos" la hora de hoy a las 00:00:00
    // Así, si la fecha es "hoy a la tarde", va a ser mayor a "hoy a las 00:00" y pasará.
    hoy.setHours(0, 0, 0, 0);

    return fecha.getTime() >= hoy.getTime();
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