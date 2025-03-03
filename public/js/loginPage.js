const loginAdminId = document.getElementById("loginAdminId");
const loginAdminPassword = document.getElementById("loginAdminPassword");
const btnLoginAdmin = document.getElementById("btnLoginAdmin");

const loginUserId = document.getElementById("loginUserId");
const loginUserPassword = document.getElementById("loginUserPassword");
const btnLoginUser = document.getElementById("btnLoginUser");

const adminApiUrl = 'http://localhost:3001/admins';  // Ruta de la API para administradores 
const userApiUrl = 'http://localhost:3001/users';  // Ruta de la API para usuarios

// Función para verificar si el ID y la contraseña del administrador son correctos
const checkAdminCredentials = async (adminId, adminPassword) => {
    try {
        const response = await fetch(`${adminApiUrl}?adminId=${adminId}&adminPassword=${adminPassword}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();
        return result.length > 0;  // Si hay algún administrador con estas credenciales
    } catch (error) {
        console.error('Error al verificar las credenciales del administrador:', error);
        return false;
    }
};

// Función para verificar si el ID y la contraseña del usuario son correctos
const checkUserCredentials = async (userId, userPassword) => {
    try {
        const response = await fetch(`${userApiUrl}?userId=${userId}&userPassword=${userPassword}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();
        return result.length > 0;  // Si hay algún usuario con estas credenciales
    } catch (error) {
        console.error('Error al verificar las credenciales del usuario:', error);
        return false;
    }
};

// Función para manejar el evento de inicio de sesión del administrador
const handleLoginAdmin = async (event) => {
    event.preventDefault();  // Prevenir la acción por defecto del formulario

    const adminId = loginAdminId.value;
    const adminPassword = loginAdminPassword.value;

    // Validar si los campos están vacíos
    if (!adminId || !adminPassword) {
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'Por favor ingrese ambos campos (ID y Contraseña).',
        });
        return;
    }

    const isValidAdmin = await checkAdminCredentials(adminId, adminPassword);
    if (isValidAdmin) {
        // Limpiar los campos después de inicio de sesión exitoso
        loginAdminId.value = '';
        loginAdminPassword.value = '';

        // Almacenar el adminId en localStorage
        localStorage.setItem('adminId', adminId);
        console.log('Admin ID almacenado:', localStorage.getItem('adminId')); // Verificación

        // Redirigir a la página de administradores
        window.location.href = 'mainPageAdmin.html';
    } else {
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'Credenciales de administrador incorrectas.',
        });
    }
};

// Función para manejar el evento de inicio de sesión del usuario
const handleLoginUser = async (event) => {
    event.preventDefault();  // Prevenir la acción por defecto del formulario

    const userId = loginUserId.value;
    const userPassword = loginUserPassword.value;

    // Validar si los campos están vacíos
    if (!userId || !userPassword) {
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'Por favor ingrese ambos campos (ID y Contraseña).',
        });
        return;
    }

    const isValidUser = await checkUserCredentials(userId, userPassword);
    if (isValidUser) {
        // Limpiar los campos después de inicio de sesión exitoso
        loginUserId.value = '';
        loginUserPassword.value = '';

        // Almacenar el userId en localStorage
        localStorage.setItem('userId', userId);
        console.log('User ID almacenado:', localStorage.getItem('userId')); // Verificación

        // Redirigir a la página de usuarios
        window.location.href = 'mainPageUsers.html';
    } else {
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'Credenciales de usuario incorrectas.',
        });
    }
};

// Asignar el evento de clic a los botones de inicio de sesión
btnLoginAdmin.addEventListener('click', handleLoginAdmin);
btnLoginUser.addEventListener('click', handleLoginUser);

// Función de verificación al cargar las páginas de administración o usuarios

// Página de administración (mainPageAdmin.html)
document.addEventListener('DOMContentLoaded', () => {
    const adminId = localStorage.getItem('adminId');
    // Si no hay adminId en localStorage, redirigir a la página de login solo una vez
    if (!adminId) {
        if (!window.location.href.includes('loginPage.html')) {
            window.location.href = '/pages/loginPage.html';
        }
    }
});

// Página de usuarios (mainPageUsers.html)
document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId');
    // Si no hay userId en localStorage, redirigir a la página de login solo una vez
    if (!userId) {
        if (!window.location.href.includes('loginPage.html')) {
            window.location.href = '/pages/loginPage.html';
        }
    }
});