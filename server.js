// Primero, importo las librerías necesarias para mi servidor.
// 'express' me ayuda a crear el servidor, 'cors' me permite manejar las políticas de acceso entre dominios,
// y 'path' es útil para manejar las rutas de los archivos de forma segura.
const express = require('express'); // Express es el framework que voy a usar para manejar mi servidor web
const cors = require('cors'); // CORS me ayuda a gestionar las solicitudes entre diferentes dominios (orígenes)
const path = require('path'); // Path es una librería estándar que me facilita trabajar con rutas de archivos

// Aquí creo la aplicación Express. 'app' va a ser el objeto que usaré para definir las rutas y configuraciones del servidor.
const app = express();

// Ahora configuro CORS para que mi servidor acepte solicitudes desde cualquier origen.
// Si necesito restringirlo a ciertos dominios más adelante, puedo especificar esos orígenes aquí.
app.use(cors());

// Configuro Express para que sirva archivos estáticos (como imágenes, hojas de estilo, scripts, etc.)
// Esto me permitirá, por ejemplo, mostrar imágenes o cargar hojas de estilo CSS desde la carpeta 'public'.
app.use(express.static(path.join(__dirname, 'public')));

// Aquí defino la ruta principal de mi aplicación web. Esto significa que cuando alguien visite la URL raíz ('/'),
// le voy a enviar el archivo 'index.html' que se encuentra en la carpeta 'public'.
// 'path.join' me ayuda a asegurar que la ruta al archivo sea correcta, sin importar el sistema operativo.
app.get('/', (req, res) => {
    // Con esta línea, envío el archivo 'index.html' al navegador del usuario
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ahora defino en qué puerto mi servidor va a escuchar. Elijo el puerto 3000, pero podría usar otro número de puerto.
// Este es el puerto donde mi aplicación estará disponible en el navegador (por ejemplo, en http://localhost:3000).
const PORT = 3000;

// Finalmente, pongo el servidor a "escuchar" en el puerto que acabo de definir.
// Cuando el servidor esté listo, la función de callback se ejecutará y me va a mostrar un mensaje en la consola
// indicando que el servidor está corriendo correctamente.
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`); // Esto es útil para saber que el servidor se está ejecutando
});