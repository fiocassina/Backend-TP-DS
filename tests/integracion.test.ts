import request from 'supertest';
import app from '../src/app'; 
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
//importamos los modelos para crear datos de prueba
import Usuario from '../src/model/usuario-model'; 
import Clase from '../src/model/clase-model';
import Proyecto from '../src/model/proyecto-model';
import TipoProyecto from '../src/model/tipoProyecto-model';

describe('GET /api/proyectos/clase/:claseId', () => {

    // variables para poder borrar después los datos de prueba
    let usuarioId: string;
    let claseId: string;
    let proyectoId: string;
    let tipoProyectoId: string;

    afterAll(async () => {
        // despues del test borramos los datos de prueba creados
        if (proyectoId) await Proyecto.findByIdAndDelete(proyectoId);
        if (tipoProyectoId) await TipoProyecto.findByIdAndDelete(tipoProyectoId);
        if (claseId) await Clase.findByIdAndDelete(claseId);
        if (usuarioId) await Usuario.findByIdAndDelete(usuarioId);
        await mongoose.connection.close();
    });

    // CASO 1
    it('Caso 1: Debería proteger los datos (401) con ID de clase válido si no hay token', async () => {
        const idReal = '68f1b5572ba55756d9b5e8b6'; 
        const res = await request(app).get(`/api/proyectos/clase/${idReal}`);
        console.log(`Caso 1 - Status (Sin token): ${res.statusCode}`);
        expect(res.statusCode).toBe(401);
    });

    // CASO 2
    it('Caso 2: Debería denegar acceso (403/404) si tengo Token pero NO soy miembro de la clase', async () => {
        const payload = { id: '68f1b5572ba55756d9b5e8b6', rol: 'alumno' };
        const secreto = process.env.JWT_SECRET || "clave-secreta"; 
        const token = jwt.sign(payload, secreto, { expiresIn: '1h' });
        
        const idClase = '68f1b5572ba55756d9b5e8b6'; //clase real
        
        const res = await request(app)
            .get(`/api/proyectos/clase/${idClase}`)
            .set('Authorization', `Bearer ${token}`);

        console.log(`Caso 2 - Status (No es miembro): ${res.statusCode}`);
        expect([403, 404]).toContain(res.statusCode); 
    });

    // CASO 3: ÉXITO
    it('Caso 3: Debería permitir entrar (200) si el usuario es alumno y hay proyectos', async () => {
        // creamos usuario, clase, proyecto y tipo proyecto vinculados para el test
        const usuarioTest = await Usuario.create({
            nombreCompleto: 'Alumno Test Borrable',
            email: `test_final_${Date.now()}@email.com`,
            password: '123',
            rol: 'alumno'
        });
        usuarioId = usuarioTest._id.toString(); 

        const claseTest = await Clase.create({
            nombre: 'Materia Test Borrable',
            materia: 'DSW',
            profesorId: new mongoose.Types.ObjectId(),
            alumnos: [usuarioTest._id], //inscribimos al alumno en la clase
            clave: '1234'
        });
        claseId = claseTest._id.toString(); 

        const tipoTest = await TipoProyecto.create({
            nombre: 'TP Test',
            clave: `TP-${Date.now()}`,
            descripcion: 'Tipo creado para el test'
        });
        tipoProyectoId = tipoTest._id.toString();

        const proyectoTest = await Proyecto.create({
            nombre: 'Proyecto Test Borrable',
            descripcion: 'Proyecto creado para el test',
            clase: claseTest._id,
            tipoProyecto: tipoTest._id, //usamos el tipo que creamos
            fechaEntrega: new Date()
        });
        proyectoId = proyectoTest._id.toString(); 


        const secreto = process.env.JWT_SECRET || "clave-secreta";
        const token = jwt.sign(
            { id: usuarioTest._id, rol: 'alumno' }, 
            secreto, 
            { expiresIn: '1h' });

        const res = await request(app)
            .get(`/api/proyectos/clase/${claseTest._id}`)
            .set('Authorization', `Bearer ${token}`);

        console.log(`Caso 3 - Status Éxito: ${res.statusCode}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });
});