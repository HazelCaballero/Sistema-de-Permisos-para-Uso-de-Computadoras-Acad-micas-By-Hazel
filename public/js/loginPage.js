//luego cambiare los alert, los tengo porque son faciles para ver si funciona o no el codigo

// recuerda que aun no funciona bien, revisalo en casa

const adminApiUrl = 'http://localhost:3001/admins';  // URL de la API para obtener los administradores
const loginAdminId = document.getElementById("loginAdminId");
const loginAdminPassword = document.getElementById("loginAdminPassword");
const btnLoginAdmin = document.getElementById("btnLoginAdmin");

// Función para iniciar sesión como administrador
const loginAdmin = async () => {
    const adminIdValue = loginAdminId.value;
    const adminPasswordValue = loginAdminPassword.value;

    // Validaciones antes de hacer la solicitud
    if (!adminIdValue || !adminPasswordValue) {
        alert('Todos los campos son obligatorios');
        return;
    }

    console.log('Validando administrador...');

    const isAdminValid = await validateAdmin(adminIdValue, adminPasswordValue);
    if (isAdminValid) {
        alert('Bienvenido, Administrador');
        window.location.href = 'mainPageAdmin.html';  // Redirige a la página principal del admin
    } else {
        alert('ID de administrador o contraseña incorrectos');
    }
};

// Función para validar los datos del administrador con la API
const validateAdmin = async (adminId, adminPassword) => {
    try {
        console.log(`Verificando administrador con ID: ${adminId} y Contraseña: ${adminPassword}`);

        const response = await fetch(adminApiUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();  // Obtener los administradores
        console.log('Respuesta de la API para administrador:', result);

        // Buscar en la respuesta si existe un administrador con el ID y la contraseña
        const admin = result.find(admin => admin.adminId === adminId && admin.adminPassword === adminPassword);
        
        if (admin) {
            console.log('Administrador validado exitosamente');
            return true;  // Si se encuentra el administrador
        } else {
            console.log('Administrador no encontrado o contraseña incorrecta');
            return false;  // Si no se encuentra el administrador
        }
    } catch (error) {
        console.error('Error al verificar el administrador:', error);
        return false;
    }
};

// Asociar la acción de clic al botón de login para administrador
btnLoginAdmin.addEventListener('click', loginAdmin);
