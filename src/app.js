const express = require('express') //importa express

const tipoMaterialRoutes = require('./routes/tipoMaterial.routes');

const app = express(); //crea instancia de express

app.use(express.json()); //p q express pueda leer json en el body de las peticiones

app.use('/tipoMaterial', tipoMaterialRoutes);

module.exports = app; //exportamos app p q el server la pueda usar
