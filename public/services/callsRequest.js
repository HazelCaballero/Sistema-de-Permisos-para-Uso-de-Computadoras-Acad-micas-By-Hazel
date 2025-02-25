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
async function getRequests() {
    try {
        const response = await fetch('http://localhost:3000/requests', {  
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
        handleError(error, 'fetching requests');
    }
}

// LLAMADO POST - Crear un nueva solicitud
async function postRequest(requestData) {
    try {
        const response = await fetch('http://localhost:3000/requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errorMessage = `Error ${response.status}: ${response.statusText}`;
            throw new Error(errorMessage);
        }

        return await response.json(); // Devolver solicitud creada
    } catch (error) {
        handleError(error, 'posting request');
    }
}

// LLAMADO DELETE - Eliminar solicitud
async function deleteRequest(requestId) {
    try {
        const response = await fetch(`http://localhost:3000/requests/${requestId}`, {
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
        handleError(error, 'deleting request');
    }
}

// LLAMADO PUT - Actualizar solicitud
async function updateRequest(requestId, updatedRequestData) {
    try {
        const response = await fetch(`http://localhost:3000/requests/${requestId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedRequestData),
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar el request: ${response.statusText}`);
        }

        const data = await response.json(); // Devolver el request actualizado
        return data;
    } catch (error) {
        console.error("Error al enviar la solicitud PUT:", error);
        throw error;
    }
}

// Exportar funciones
export { getRequests, postRequest, deleteRequest, updateRequest };