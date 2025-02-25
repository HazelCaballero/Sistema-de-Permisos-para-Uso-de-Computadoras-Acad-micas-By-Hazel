// Función para manejar errores
function handleError(error, action) {
    if (error instanceof TypeError) {
        console.error(`Network error during ${action}:`, error);
    } else {
        console.error(`Error during ${action}:`, error);
    }
    throw error;
}

// LLAMADO GET - Obtener todos los administradores
async function getRequests() {
    try {
        const response = await fetch('http://localhost:3001/admins', {  
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
        handleError(error, 'fetching admins');
    }
}

// LLAMADO POST - Crear un nuevo administrador
async function postRequest(adminData) {
    try {
        const response = await fetch('http://localhost:3001/admins', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(adminData)
        });

        if (!response.ok) {
            const errorMessage = `Error ${response.status}: ${response.statusText}`;
            throw new Error(errorMessage);
        }

        return await response.json(); // Devolver el administrador creado
    } catch (error) {
        handleError(error, 'posting admin');
    }
}

// LLAMADO DELETE - Eliminar un administrador
async function deleteRequest(adminId) {
    try {
        const response = await fetch(`http://localhost:3001/admins/${adminId}`, {
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
        handleError(error, 'deleting admin');
    }
}

// LLAMADO PUT - Actualizar un administrador
async function updateRequest(adminId, updatedRequestData) {
    try {
        const response = await fetch(`http://localhost:3001/admins/${adminId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedRequestData),
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar el administrador: ${response.statusText}`);
        }

        const data = await response.json(); // Devolver el administrador actualizado
        return data;
    } catch (error) {
        console.error("Error al enviar la solicitud PUT:", error);
        throw error;
    }
}

// Exportar funciones
export { getRequests, postRequest, deleteRequest, updateRequest };