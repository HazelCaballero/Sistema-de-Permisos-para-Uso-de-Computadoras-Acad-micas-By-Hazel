// La función `handleError` se encarga de manejar los errores de red o cualquier otro error
// que pueda ocurrir durante las solicitudes. Primero verifica si el error es de tipo `TypeError`
// (lo que sugiere un problema de red) y luego imprime el error con un mensaje relacionado con la acción
// que falló. Si no es un error de red, simplemente imprime el error genérico.
function handleError(error, action) {
    if (error instanceof TypeError) {
        // Si el error es un TypeError, típicamente relacionado con problemas de red,
        // se imprime un mensaje específico para errores de red.
        console.error(`Network error during ${action}:`, error);
    } else {
        // Si el error es otro tipo, se imprime con un mensaje genérico.
        console.error(`Error during ${action}:`, error);
    }
    // Luego, el error es lanzado para que pueda ser manejado de nuevo más arriba en la cadena de promesas.
    throw error;
}

// La función `getAdmins` realiza una solicitud GET al servidor para obtener todos los administradores.
// Se espera que la respuesta del servidor sea un JSON con la lista de administradores.
async function getAdmins() {
    try {
        // Se hace una solicitud GET al servidor en la URL especificada para obtener los administradores.
        const response = await fetch('http://localhost:3001/admins', {  
            method: 'GET',  // El método de la solicitud es GET, ya que se quiere obtener datos.
            headers: {
                'Content-Type': 'application/json'  // Se especifica que el contenido que esperamos es JSON.
            }
        });

        // Si la respuesta no es exitosa (es decir, si el estado no es 2xx), se lanza un error.
        if (!response.ok) {
            const errorMessage = `Error ${response.status}: ${response.statusText}`;
            // Se lanza un error con el mensaje de error recibido del servidor.
            throw new Error(errorMessage);
        }

        // Si la respuesta es exitosa, se retorna la respuesta en formato JSON.
        return await response.json();
    } catch (error) {
        // Si ocurre un error al hacer la solicitud o al procesar la respuesta,
        // se llama a la función `handleError` para gestionar el error.
        handleError(error, 'fetching admins');
    }
}

// La función `postAdmin` se utiliza para crear un nuevo administrador.
// Envía los datos del nuevo administrador al servidor usando el método POST.
async function postAdmin(adminData) {
    try {
        // Se hace una solicitud POST con los datos del administrador a crear.
        const response = await fetch('http://localhost:3001/admins', {
            method: 'POST',  // Se usa el método POST porque se está enviando datos para crear algo nuevo.
            headers: {
                'Content-Type': 'application/json'  // Se indica que los datos que se envían son de tipo JSON.
            },
            // Los datos del nuevo administrador se convierten a formato JSON antes de enviarlos.
            body: JSON.stringify(adminData)
        });

        // Si la respuesta del servidor no es exitosa, se lanza un error.
        if (!response.ok) {
            const errorMessage = `Error ${response.status}: ${response.statusText}`;
            // Se lanza un error con el mensaje de error proporcionado por el servidor.
            throw new Error(errorMessage);
        }

        // Si la respuesta es exitosa, se retorna el administrador creado en formato JSON.
        return await response.json();
    } catch (error) {
        // Si ocurre un error durante la solicitud o el procesamiento de la respuesta,
        // se llama a la función `handleError` para gestionar el error.
        handleError(error, 'posting admin');
    }
}

// La función `deleteAdmin` se utiliza para eliminar un administrador existente.
// Realiza una solicitud DELETE al servidor para eliminar al administrador por su ID.
async function deleteAdmin(adminId) {
    try {
        // Se hace una solicitud DELETE al servidor para eliminar el administrador con el ID proporcionado.
        const response = await fetch(`http://localhost:3001/admins/${adminId}`, {
            method: 'DELETE',  // El método de la solicitud es DELETE, ya que se eliminará un recurso.
            headers: {
                'Content-Type': 'application/json'  // Se especifica que la respuesta será de tipo JSON.
            }
        });

        // Si la respuesta no es exitosa, se lanza un error.
        if (!response.ok) {
            const errorMessage = `Error ${response.status}: ${response.statusText}`;
            // Se lanza un error con el mensaje de error proporcionado por el servidor.
            throw new Error(errorMessage);
        }

        // Si la eliminación es exitosa, se retorna la respuesta del servidor en formato JSON.
        return await response.json();
    } catch (error) {
        // Si ocurre un error al realizar la solicitud o procesar la respuesta,
        // se llama a la función `handleError` para gestionar el error.
        handleError(error, 'deleting admin');
    }
}

// La función `updateAdmin` se utiliza para actualizar los datos de un administrador existente.
// Realiza una solicitud PUT al servidor para modificar los datos de un administrador por su ID.
async function updateAdmin(adminId, updatedAdminData) {
    try {
        // Se hace una solicitud PUT al servidor para actualizar el administrador con el ID proporcionado.
        const response = await fetch(`http://localhost:3001/admins/${adminId}`, {
            method: 'PUT',  // Usamos el método PUT porque estamos modificando un recurso existente.
            headers: {
                'Content-Type': 'application/json',  // Indicamos que los datos enviados están en formato JSON.
            },
            // Los datos actualizados del administrador se convierten a JSON antes de enviarlos.
            body: JSON.stringify(updatedAdminData),
        });

        // Si la respuesta no es exitosa, se lanza un error con el estado y el mensaje del servidor.
        if (!response.ok) {
            throw new Error(`Error al actualizar el administrador: ${response.statusText}`);
        }

        // Si la actualización es exitosa, se retorna el administrador actualizado en formato JSON.
        const data = await response.json();
        return data;
    } catch (error) {
        // Si ocurre un error durante la solicitud PUT, se imprime un mensaje de error en la consola.
        console.error("Error al enviar la solicitud PUT:", error);
        // Finalmente, se lanza el error para que pueda ser manejado más arriba si es necesario.
        throw error;
    }
}

// Las funciones `getAdmins`, `postAdmin`, `deleteAdmin`, y `updateAdmin` se exportan
// para que puedan ser utilizadas en otras partes del proyecto donde sea necesario.
export { getAdmins, postAdmin, deleteAdmin, updateAdmin };