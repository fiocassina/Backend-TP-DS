import express from 'express';
import tipoMaterialRoutes from './routes/tipoMaterial.routes.js';
const app = express();
app.use(express.json());
app.use('/tipomateriales', tipoMaterialRoutes);
app.listen(3000, () => {
    console.log('Server runnning on http://localhost:3000/');
});
//# sourceMappingURL=app.js.map