// Función para manejar errores
// Esta función la uso para gestionar los errores que puedan surgir durante las peticiones a la API.
// Dependiendo del tipo de error, lo voy a manejar de manera distinta (por ejemplo, si es un error de red o de otro tipo).
function handleError(error, action) {
    // Si el error es un TypeError (generalmente relacionado con la red), lo manejo de esta forma.
    if (error instanceof TypeError) {
        console.error(`Network error during ${action}:`, error);
    } else {
        // Si el error es otro tipo, como un error general, lo manejo de esta forma.
        console.error(`Error during ${action}:`, error);
    }
    // Luego lanzo el error para que pueda ser manejado más arriba si es necesario.
    throw error;
}

// LLAMADO GET - Obtener todas las solicitudes
// Aquí hago una solicitud GET a la API para obtener los usuarios. Si todo va bien, devuelvo los datos.
async function getUsers() {
    try {
        // Hago la petición GET a la API, pidiendo los usuarios.
        const response = await fetch('http://localhost:3000/users', {  
            method: 'GET', // Método GET porque solo quiero obtener datos.
            headers: {
                'Content-Type': 'application/json' // Indico que la comunicación es en formato JSON.
            }
        });

        // Si la respuesta no es 200 OK, lanzo un error.
        if (!response.ok) {
            const errorMessage = `Error ${response.status}: ${response.statusText}`;
            throw new Error(errorMessage); // Si hay un error en la respuesta, lo lanzo.
        }

        // Si todo salió bien, devuelvo los datos en formato JSON.
        return await response.json();
    } catch (error) {
        // Si ocurre algún error, lo manejo con la función handleError.
        handleError(error, 'fetching users');
    }
}

// LLAMADO POST - Crear un nuevo user
// Esta función crea un nuevo usuario. Tomo los datos del usuario, hago una petición POST y luego devuelvo el usuario creado.
async function postUser(userData) {
    try {
        // Hago una solicitud POST con los datos del nuevo usuario.
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST', // Método POST porque estoy creando un nuevo recurso.
            headers: {
                'Content-Type': 'application/json' // Indico que voy a enviar los datos en formato JSON.
            },
            body: JSON.stringify(userData) // Convierte el objeto userData a JSON para enviarlo en el cuerpo de la solicitud.
        });

        // Si la respuesta no es exitosa (por ejemplo, error 400 o 500), lanzo un error.
        if (!response.ok) {
            const errorMessage = `Error ${response.status}: ${response.statusText}`;
            throw new Error(errorMessage); // Si ocurre un error, lanzo un mensaje de error.
        }

        // Si todo fue bien, devuelvo el usuario que se creó, también en formato JSON.
        return await response.json();
    } catch (error) {
        // Si algo sale mal, lo manejo con la función handleError.
        handleError(error, 'posting user');
    }
}

// LLAMADO DELETE - Eliminar usuario
// Aquí elimino un usuario con un ID específico. La solicitud DELETE elimina el usuario de la base de datos.
async function deleteUser(userId) {
    try {
        // Hago una solicitud DELETE con el ID del usuario que quiero eliminar.
        const response = await fetch(`http://localhost:3000/users/${userId}`, {
            method: 'DELETE', // Método DELETE porque quiero eliminar el recurso.
            headers: {
                'Content-Type': 'application/json' // Envío y espero datos en formato JSON.
            }
        });

        // Si la respuesta no es exitosa (por ejemplo, el usuario no existe), lanzo un error.
        if (!response.ok) {
            const errorMessage = `Error ${response.status}: ${response.statusText}`;
            throw new Error(errorMessage); // Lanza un error con el mensaje adecuado.
        }

        // Si la eliminación fue exitosa, devuelvo la respuesta del servidor, que normalmente indica que todo salió bien.
        return await response.json();
    } catch (error) {
        // Si ocurre un error durante la eliminación, lo manejo con handleError.
        handleError(error, 'deleting user');
    }
}

// LLAMADO PUT - Actualizar user
// Esta función actualiza un usuario existente con los nuevos datos que le paso como parámetro.
async function updateUser(userId, updatedUserData) {
    try {
        // Hago una solicitud PUT, que se usa para actualizar un recurso existente.
        const response = await fetch(`http://localhost:3000/users/${userId}`, {
            method: 'PUT', // Método PUT porque estoy actualizando el usuario.
            headers: {
                'Content-Type': 'application/json', // Envío y espero JSON en la comunicación.
            },
            body: JSON.stringify(updatedUserData), // Los nuevos datos del usuario los envío como JSON.
        });

        // Si la respuesta no es exitosa, lanzo un error indicando que no se pudo actualizar el usuario.
        if (!response.ok) {
            throw new Error(`Error al actualizar el User: ${response.statusText}`); // Si la actualización falla, lanzo un error.
        }

        // Si todo fue bien, devuelvo el usuario actualizado.
        const data = await response.json();
        return data;
    } catch (error) {
        // Si ocurre un error durante la solicitud PUT, lo imprimo en la consola.
        console.error("Error al enviar la solicitud PUT:", error);
        // Vuelvo a lanzar el error para que pueda ser manejado por quien haga la llamada.
        throw error;
    }
}

// Exporto las funciones para que puedan ser usadas en otros módulos.
export { getUsers, postUser, deleteUser, updateUser };