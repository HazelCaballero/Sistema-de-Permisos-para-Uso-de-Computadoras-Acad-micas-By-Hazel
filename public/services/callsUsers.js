// Función para manejar errores
function handleError(error, action) {
    if (error instanceof TypeError) {
        console.error(`Network error during ${action}:`, error);
    } else {
        console.error(`Error during ${action}:`, error);
    }
    throw error;
}

// LLAMADO GET - Obtener todas las solicitudes
async function getUsers() {
    try {
        const response = await fetch('http://localhost:3000/users', {  
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorMessage = `Error ${response.status}: ${response.statusText}`;
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        handleError(error, 'fetching users');
    }
}

// LLAMADO POST - Crear un nuevo user
async function postUser(userData) {
    try {
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorMessage = `Error ${response.status}: ${response.statusText}`;
            throw new Error(errorMessage);
        }

        return await response.json(); // Devolver user creado
    } catch (error) {
        handleError(error, 'posting user');
    }
}

// LLAMADO DELETE - Eliminar usuario
async function deleteUser(userId) {
    try {
        const response = await fetch(`http://localhost:3000/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorMessage = `Error ${response.status}: ${response.statusText}`;
            throw new Error(errorMessage);
        }

        return await response.json(); // Devolver la respuesta del servidor
    } catch (error) {
        handleError(error, 'deleting user');
    }
}

// LLAMADO PUT - Actualizar user
async function updateUser(userId, updatedUserData) {
    try {
        const response = await fetch(`http://localhost:3000/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUserData),
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar el User: ${response.statusText}`);
        }

        const data = await response.json(); // Devolver el User actualizado
        return data;
    } catch (error) {
        console.error("Error al enviar la solicitud PUT:", error);
        throw error;
    }
}

// Exportar funciones
export { getUsers, postUser, deleteUser, updateUser };