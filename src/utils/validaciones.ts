export const esFechaFutura = (fecha: Date): boolean => {
    const hoy = new Date();
    
    hoy.setHours(0, 0, 0, 0);

    return fecha.getTime() >= hoy.getTime();
};
export const esEmailValido = (email: string): boolean => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const esNotaValida = (nota: number): boolean => {
    return nota >= 1 && nota <= 10;
};

export const esTextoValido = (texto: string, min: number, max?: number): boolean => {
    if (!texto) return false;
    const len = texto.trim().length;
    return len >= min && (max === undefined || len <= max);
};

export const esPasswordValida = (password: string): boolean => {
    return typeof password === 'string' && password.length >= 6 && /[A-Z]/.test(password) && /[0-9]/.test(password);
};