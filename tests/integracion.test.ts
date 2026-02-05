import request from 'supertest';
import app from '../src/app'; 
import mongoose from 'mongoose';

describe('GET /api/proyectos/mis-proyectos', () => {

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('Debería validar respuesta del endpoint de proyectos', async () => {
        const res = await request(app).get('/api/proyectos/mis-proyectos');
       
        console.log(`Status recibido: ${res.statusCode}`);

        expect([200, 401]).toContain(res.statusCode);
    });
});