//luego cambiare los alert, los tengo porque son faciles para ver si funciona o no el codigo

const adminApiUrl = 'http://localhost:3001/admins';  // Ruta de la API para administradores
const userApiUrl = 'http://localhost:3001/users';  // Ruta de la API para usuarios

const adminId = document.getElementById("adminId");
const adminPassword = document.getElementById("adminPassword");
const btnCreateAdmin = document.getElementById("btnCreateAdmin");

const userId = document.getElementById("userId");
const userPassword = document.getElementById("userPassword");
const btnCreateUser = document.getElementById("btnCreateUser");

// Función para agregar un administrador
const saveAdmin = async () => {
    const adminIdValue = adminId.value;
    const adminPasswordValue = adminPassword.value;

    // Validaciones antes de hacer la solicitud
    if (!adminIdValue || !adminPasswordValue) {
        alert('Todos los campos son obligatorios');
        return;
    }

    // Verificar si el adminId ya existe
    const isAdminIdTaken = await checkAdminId(adminIdValue);
    if (isAdminIdTaken) {
        alert('ID de administrador ya utilizado, por favor usar otro.');
        return;
    }

    const newAdmin = {
        adminId: adminIdValue,
        adminPassword: adminPasswordValue,
    };

    try {
        const response = await fetch(adminApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAdmin)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Administrador guardado correctamente');
            resetFormAdmin();  // Resetear el formulario
        } else {
            alert('Error al guardar el administrador: ' + result.message);
            console.log(result);  // Ver el error en consola
        }
    } catch (error) {
        console.error('Error al guardar el administrador:', error);
    }
};

// Función para verificar si el adminId ya existe
const checkAdminId = async (adminId) => {
    try {
        const response = await fetch(`${adminApiUrl}?adminId=${adminId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.json();
        return result.length > 0;
    } catch (error) {
        console.error('Error al verificar el adminId:', error);
        return false;
    }
};

// Resetear el formulario para administradores
const resetFormAdmin = () => {
    adminId.value = '';
    adminPassword.value = '';
};

// Asociar la acción de clic al botón para crear administrador
btnCreateAdmin.addEventListener('click', saveAdmin);

// Función para agregar un usuario
const saveUser = async () => {
    const userIdValue = userId.value;
    const userPasswordValue = userPassword.value;

    // Validaciones antes de hacer la solicitud
    if (!userIdValue || !userPasswordValue) {
        alert('Todos los campos son obligatorios');
        return;
    }

    // Verificar si el userId ya existe
    const isUserIdTaken = await checkUserId(userIdValue);
    if (isUserIdTaken) {
        alert('ID de usuario ya utilizado, por favor usar otro.');
        return;
    }

    const newUser = {
        userId: userIdValue,
        userPassword: userPasswordValue,
    };

    try {
        const response = await fetch(userApiUrl, {  // Cambié a userApiUrl
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Usuario guardado correctamente');
            resetFormUser();  // Resetear el formulario
        } else {
            alert('Error al guardar el usuario: ' + result.message);
            console.log(result);  // Ver el error en consola
        }
    } catch (error) {
        console.error('Error al guardar el usuario', error);
    }
};

// Función para verificar si el userId ya existe
const checkUserId = async (userId) => {
    try {
        const response = await fetch(`${userApiUrl}?userId=${userId}`, {  // Cambié a userApiUrl
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.json();
        return result.length > 0;
    } catch (error) {
        console.error('Error al verificar el userId:', error);
        return false;
    }
};

// Resetear el formulario para usuarios
const resetFormUser = () => {
    userId.value = '';
    userPassword.value = '';
};

// Asociar la acción de clic al botón para crear usuario
btnCreateUser.addEventListener('click', saveUser);
