const express = require('express');
const app = express();
const path = require('path');

// Sirve los archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para el archivo 'index.html' en 'public/pages'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
