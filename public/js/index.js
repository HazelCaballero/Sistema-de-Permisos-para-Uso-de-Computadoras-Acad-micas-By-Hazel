const apiUrl = 'http://localhost:3001/admins'; // Ruta de la API
//import { getRequests, postRequest, deleteRequest, updateRequest } from "./services/callsAdmins.js"

const adminId = document.getElementById("adminId")
const adminPassword = document.getElementById("adminPassword")
const adminAuthKey = document.getElementById("adminAuthKey")
const btnCreateAdmin = document.getElementById("btnCreateAdmin")
const userId = document.getElementById("userId")
const userPassword = document.getElementById("userPassword")
const userAuthKey = document.getElementById("userAuthKey")
const btnCreateUser = document.getElementById("btnCreateUser")


// Función para agregar
const saveAdmin = async () => {
    const newAdmin = {
        adminId: document.getElementById('adminId').value,
        adminPassword: document.getElementById('adminPassword').value,
        adminAuthKey: document.getElementById('adminAuthKey').value
    }
    try {
            response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAdmin)
            });
        

        const result = await response.json();

        if (response.ok) {
            alert('Administrador guardado correctamente');
            resetForm(); // Resetear el formulario
        } else {
            alert('Error al guardar el administrador: ' + result.message);
        }
    } catch (error) {
        console.error('Error al guardar el administrador:', error);
    }

// Resetear el formulario después de agregar o editar el administrador
const resetForm = () => {
    document.getElementById('adminId').value = '';
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminAuthKey').value = '';
};}
