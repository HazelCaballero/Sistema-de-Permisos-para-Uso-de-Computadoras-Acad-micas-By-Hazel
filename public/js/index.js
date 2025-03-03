// Definición de las URLs de la API para administradores y usuarios
const adminApiUrl = 'http://localhost:3001/admins';  // Ruta de la API para administradores
const userApiUrl = 'http://localhost:3001/users';  // Ruta de la API para usuarios

// Obtención de los elementos del DOM para administradores
const adminId = document.getElementById("adminId");  // Campo para el ID del administrador
const adminPassword = document.getElementById("adminPassword");  // Campo para la contraseña del administrador
const btnCreateAdmin = document.getElementById("btnCreateAdmin");  // Botón para crear un nuevo administrador

// Obtención de los elementos del DOM para usuarios
const userId = document.getElementById("userId");  // Campo para el ID del usuario
const userPassword = document.getElementById("userPassword");  // Campo para la contraseña del usuario
const btnCreateUser = document.getElementById("btnCreateUser");  // Botón para crear un nuevo usuario

// Función para validar el ID de usuario: debe tener al menos 5 caracteres y ser alfanumérico
const validateUserId = (userId) => {
    const regex = /^[a-zA-Z0-9]{5,}$/;  // Expresión regular: al menos 5 caracteres, solo letras y números
    return regex.test(userId);  // Verifica si el ID del usuario cumple con el patrón
};

// Función para validar la contraseña del usuario o administrador
// La contraseña debe tener al menos 8 caracteres y contener mayúsculas, minúsculas y números
const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;  // Expresión regular para validar contraseña
    return regex.test(password);  // Verifica si la contraseña cumple con el patrón
};

// Función para agregar un administrador: se llama al hacer clic en el botón "Crear Administrador"
const saveAdmin = async (event) => {
    event.preventDefault();  // Prevenir el comportamiento por defecto del formulario

    const adminIdValue = adminId.value;  // Obtenemos el valor del ID del administrador
    const adminPasswordValue = adminPassword.value;  // Obtenemos el valor de la contraseña del administrador

    // Validaciones antes de enviar la solicitud
    if (!adminIdValue || !adminPasswordValue) {
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'Todos los campos son obligatorios',  // Mostramos una alerta si algún campo está vacío
        });
        return;
    }

    // Validación del ID del administrador
    if (!validateUserId(adminIdValue)) {
        Swal.fire({
            icon: 'error',
            title: '¡ID no válido!',
            text: 'El ID de administrador debe tener al menos 5 caracteres y solo puede contener letras y números. Por favor, crea uno con estos requisitos.',
            customClass: {
                popup: 'myPopupClass'  // Personalizamos la clase del popup
            },
            backdrop: 'rgba(0, 0, 0, 0.5)',  // Fondo semitransparente para resaltar el modal
            didOpen: () => {
                document.body.style.overflow = 'hidden';  // Desactivar el scroll para evitar que se mueva la página
            },
            willClose: () => {
                document.body.style.overflow = '';  // Restaurar el scroll después de cerrar el modal
            }
        });
        return;
    }

    // Validación de la contraseña del administrador
    if (!validatePassword(adminPasswordValue)) {
        Swal.fire({
            icon: 'error',
            title: '¡Contraseña no válida!',
            text: 'La contraseña debe tener al menos 8 caracteres, incluir al menos una letra mayúscula, una minúscula y un número. Por favor, crea una nueva contraseña con estos requisitos.',
        });
        return;
    }

    // Verificación de que el ID del administrador no esté en uso
    const isAdminIdTaken = await checkAdminId(adminIdValue);
    if (isAdminIdTaken) {
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'ID de administrador ya utilizado, por favor usa otro.',
        });
        return;
    }

    // Crear el objeto del nuevo administrador
    const newAdmin = {
        adminId: adminIdValue,
        adminPassword: adminPasswordValue,
    };

    try {
        // Enviar la solicitud POST para crear el administrador en la base de datos
        const response = await fetch(adminApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },  // Especificamos que los datos serán en formato JSON
            body: JSON.stringify(newAdmin)  // Convertimos el objeto del nuevo administrador a JSON
        });

        const result = await response.json();  // Convertimos la respuesta del servidor en un objeto JSON

        if (response.ok) {
            // Si la solicitud fue exitosa, mostramos un mensaje de éxito
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Administrador guardado correctamente',
            });
            resetFormAdmin();  // Restablecer el formulario de administrador
        } else {
            // Si la solicitud no fue exitosa, mostramos un mensaje de error con el mensaje devuelto por el servidor
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'Error al guardar el administrador: ' + result.message,
            });
            console.log(result);  // Mostrar el resultado completo en la consola
        }
    } catch (error) {
        console.error('Error al guardar el administrador:', error);  // Mostrar cualquier error que ocurra durante el proceso
    }
};

// Función para verificar si el ID de administrador ya existe en la base de datos
const checkAdminId = async (adminId) => {
    try {
        // Realizamos una solicitud GET para buscar si el ID ya está en uso
        const response = await fetch(`${adminApiUrl}?adminId=${adminId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.json();
        return result.length > 0;  // Si se encuentra al menos un registro, devolvemos true
    } catch (error) {
        console.error('Error al verificar el adminId:', error);  // Mostrar cualquier error al verificar el adminId
        return false;  // Si ocurre un error, devolvemos false para continuar con la creación
    }
};

// Función para restablecer los campos del formulario de administrador
const resetFormAdmin = () => {
    adminId.value = '';  // Limpiar el campo del ID
    adminPassword.value = '';  // Limpiar el campo de la contraseña
};

// Asociamos el evento de clic del botón "Crear Administrador" con la función saveAdmin
btnCreateAdmin.addEventListener('click', saveAdmin);

// Función para agregar un usuario: se llama al hacer clic en el botón "Crear Usuario"
const saveUser = async (event) => {
    event.preventDefault();  // Prevenir el comportamiento por defecto del formulario

    const userIdValue = userId.value;  // Obtenemos el valor del ID del usuario
    const userPasswordValue = userPassword.value;  // Obtenemos el valor de la contraseña del usuario

    // Validaciones antes de enviar la solicitud
    if (!userIdValue || !userPasswordValue) {
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'Todos los campos son obligatorios',  // Mostramos una alerta si algún campo está vacío
        });
        return;
    }

    // Validación del ID del usuario
    if (!validateUserId(userIdValue)) {
        Swal.fire({
            icon: 'error',
            title: '¡ID no válido!',
            text: 'El ID de usuario debe tener al menos 5 caracteres y solo puede contener letras y números. Por favor, crea uno con estos requisitos.',
            customClass: {
                popup: 'myPopupClass'  // Personalizamos la clase del popup
            },
            backdrop: 'rgba(0, 0, 0, 0.5)',  // Fondo semitransparente para resaltar el modal
            didOpen: () => {
                document.body.style.overflow = 'hidden';  // Desactivar el scroll para evitar que se mueva la página
            },
            willClose: () => {
                document.body.style.overflow = '';  // Restaurar el scroll después de cerrar el modal
            }
        });
        return;
    }

    // Validación de la contraseña del usuario
    if (!validatePassword(userPasswordValue)) {
        Swal.fire({
            icon: 'error',
            title: '¡Contraseña no válida!',
            text: 'La contraseña debe tener al menos 8 caracteres, incluir al menos una letra mayúscula, una minúscula y un número. Por favor, crea una nueva contraseña con estos requisitos.',
        });
        return;
    }

    // Verificación de que el ID de usuario no esté en uso
    const isUserIdTaken = await checkUserId(userIdValue);
    if (isUserIdTaken) {
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'ID de usuario ya utilizado, por favor usa otro.',
        });
        return;
    }

    // Crear el objeto del nuevo usuario
    const newUser = {
        userId: userIdValue,
        userPassword: userPasswordValue,
    };

    try {
        // Enviar la solicitud POST para crear el usuario en la base de datos
        const response = await fetch(userApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },  // Especificamos que los datos serán en formato JSON
            body: JSON.stringify(newUser)  // Convertimos el objeto del nuevo usuario a JSON
        });

        const result = await response.json();  // Convertimos la respuesta del servidor en un objeto JSON

        if (response.ok) {
            // Si la solicitud fue exitosa, mostramos un mensaje de éxito
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Usuario guardado correctamente',
            });
            resetFormUser();  // Restablecer el formulario de usuario
        } else {
            // Si la solicitud no fue exitosa, mostramos un mensaje de error con el mensaje devuelto por el servidor
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'Error al guardar el usuario: ' + result.message,
            });
            console.log(result);  // Mostrar el resultado completo en la consola
        }
    } catch (error) {
        console.error('Error al guardar el usuario', error);  // Mostrar cualquier error que ocurra durante el proceso
    }
};

// Función para verificar si el ID de usuario ya existe en la base de datos
const checkUserId = async (userId) => {
    try {
        // Realizamos una solicitud GET para buscar si el ID ya está en uso
        const response = await fetch(`${userApiUrl}?userId=${userId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.json();
        return result.length > 0;  // Si se encuentra al menos un registro, devolvemos true
    } catch (error) {
        console.error('Error al verificar el userId:', error);  // Mostrar cualquier error al verificar el userId
        return false;  // Si ocurre un error, devolvemos false para continuar con la creación
    }
};

// Función para restablecer los campos del formulario de usuario
const resetFormUser = () => {
    userId.value = '';  // Limpiar el campo del ID
    userPassword.value = '';  // Limpiar el campo de la contraseña
};

// Asociamos el evento de clic del botón "Crear Usuario" con la función saveUser
btnCreateUser.addEventListener('click', saveUser);