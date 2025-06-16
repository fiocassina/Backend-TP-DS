const app = require('./app'); //trae la config de express q hice en app.js (iniciar al servidor)

const PORT = 3000; //puerto donde se va a iniciar la app

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
