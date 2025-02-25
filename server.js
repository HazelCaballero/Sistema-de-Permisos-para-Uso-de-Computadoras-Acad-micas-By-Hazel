//trabajado en base al hecho para proyecto de producto asi que necesita revision

const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

// Middleware para parsear el cuerpo de la solicitud
app.use(express.json());

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));


// Ruta para obtener todos los administradores
app.get('/admins', async (req, res) => {
    const filePath = path.join(__dirname, 'db.json');
    
    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const db = JSON.parse(data);
        res.status(200).json(db.admins);  // Devolver todos los administradores
    } catch (err) {
        res.status(500).json({ message: 'Error al leer la base de datos de administradores' });
    }
});

// Ruta para crear un administrador
app.post('/admins', async (req, res) => {
    const { adminIdDB, passwordDB } = req.body;

    if (!adminIdDB || !passwordDB) {
        return res.status(400).json({ message: 'ID y contraseña son requeridos' });
    }

    const filePath = path.join(__dirname, 'db.json');

    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const db = JSON.parse(data);

        const adminExists = db.admins.find(admin => admin.adminIdDB === adminIdDB);
        if (adminExists) {
            return res.status(400).json({ message: 'El administrador ya existe' });
        }

        const hashedPassword = await bcrypt.hash(passwordDB, 10);
        const adminAuthKey = generateAuthKey();

        const newAdmin = { adminIdDB, passwordDB: hashedPassword, adminAuthKey };
        db.admins.push(newAdmin);

        await fs.promises.writeFile(filePath, JSON.stringify(db, null, 2));
        res.status(201).json({ message: 'Administrador creado correctamente', adminAuthKey });
    } catch (err) {
        res.status(500).json({ message: 'Error al leer o guardar la base de datos de administradores' });
    }
});

// Ruta para eliminar un administrador
app.delete('/admins/:adminIdDB', async (req, res) => {
    const { adminId } = req.params;
    const filePath = path.join(__dirname, 'db.json');

    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const db = JSON.parse(data);

        const adminIndex = db.admins.findIndex(admin => admin.adminIdDB === adminId);
        if (adminIndex === -1) {
            return res.status(404).json({ message: 'Administrador no encontrado' });
        }

        db.admins.splice(adminIndex, 1);
        await fs.promises.writeFile(filePath, JSON.stringify(db, null, 2));
        res.status(200).json({ message: 'Administrador eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al leer o guardar la base de datos de administradores' });
    }
});

// Ruta para actualizar un administrador
app.put('/admins/:adminIdDB', async (req, res) => {
    const { adminId } = req.params;
    const { newAdminId, newAdminPassword } = req.body;
    const filePath = path.join(__dirname, 'db.json');

    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const db = JSON.parse(data);

        const admin = db.admins.find(admin => admin.adminIdDB === adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Administrador no encontrado' });
        }

        if (newAdminId) admin.adminIdDB = newAdminId;
        if (newAdminPassword) admin.passwordDB = await bcrypt.hash(newPassword, 10); // Actualizar contraseña cifrada

        await fs.promises.writeFile(filePath, JSON.stringify(db, null, 2));
        res.status(200).json({ message: 'Administrador actualizado correctamente', admin });
    } catch (err) {
        res.status(500).json({ message: 'Error al leer o guardar la base de datos de administradores' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});