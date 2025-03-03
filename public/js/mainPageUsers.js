document.addEventListener('DOMContentLoaded', async () => {
    // Primero, obtenemos los elementos del DOM con los que vamos a interactuar.
    const userNameElement = document.getElementById('userName'); // El elemento donde mostraremos el nombre del usuario.
    const submitRequestButton = document.getElementById('submitRequestButton'); // El botón para enviar la solicitud.
    const headquarterSelect = document.getElementById('headquarterSelect'); // El selector para elegir la sede.
    const departureDateInput = document.getElementById('departureDate'); // El campo de la fecha de salida.
    const returnDateInput = document.getElementById('returnDate'); // El campo de la fecha de regreso.
    const computerCodeInput = document.getElementById('computerCode'); // El campo para ingresar el código de la computadora.
    const termsCheckboxInput = document.getElementById('termsCheckbox'); // El checkbox para aceptar los términos.
    const requestUserContainer = document.getElementById('requestUserContainer'); // El contenedor donde mostraremos las solicitudes aprobadas o denegadas.
    const requestUserPending = document.getElementById('requestUserPending'); // El contenedor donde mostraremos las solicitudes pendientes.

    // Recuperamos el ID del usuario desde el almacenamiento local.
    const userId = localStorage.getItem('userId'); // Usamos localStorage para obtener el ID del usuario.

    // Si tenemos un ID de usuario, lo mostramos en la interfaz. Si no, redirigimos al login.
    if (userId) {
        userNameElement.textContent = `Usuario: ${userId}`; // Mostramos el ID de usuario en la interfaz.
    } else {
        // Si no encontramos el ID de usuario, mostramos una alerta y redirigimos al login.
        alert('No se encontró el ID de usuario. Redirigiendo a login...');
        window.location.href = '/pages/loginPage.html'; // Redirigimos al login si no hay ID.
    }

    // Creamos una función asíncrona para obtener todas las solicitudes desde el servidor.
    const fetchRequests = async () => {
        const response = await fetch('http://localhost:3001/requests'); // Hacemos la solicitud GET al servidor.
        return await response.json(); // Convertimos la respuesta a JSON y la retornamos.
    };

    // Creamos una función para obtener las solicitudes pendientes del usuario actual.
    const getPendingRequests = async () => {
        const requests = await fetchRequests(); // Llamamos a fetchRequests para obtener todas las solicitudes.
        return requests.filter(request => request.userId === userId && request.status === 'Pendiente'); // Filtramos solo las solicitudes pendientes del usuario.
    };

    // Creamos una función para obtener las solicitudes aprobadas o denegadas del usuario.
    const getApprovedDeniedRequests = async () => {
        const requests = await fetchRequests(); // Obtenemos todas las solicitudes nuevamente.
        return requests.filter(request => request.userId === userId && request.status !== 'Pendiente'); // Filtramos las solicitudes que no son pendientes.
    };

    // Definimos una función para eliminar una solicitud del servidor.
    const deleteRequest = async (requestId) => {
        try {
            const response = await fetch(`http://localhost:3001/requests/${requestId}`, {
                method: 'DELETE', // Usamos el método DELETE para eliminar la solicitud.
            });

            if (response.ok) {
                // Si la solicitud se elimina correctamente, mostramos un mensaje de éxito.
                Swal.fire({
                    icon: 'success',
                    title: '¡Solicitud eliminada!',
                    text: 'Tu solicitud ha sido eliminada exitosamente.',
                });
                updateUIForRequests(); // Actualizamos la interfaz para reflejar los cambios.
            } else {
                // Si hay un problema al eliminar la solicitud, mostramos un mensaje de error.
                throw new Error('Hubo un problema al eliminar la solicitud.');
            }
        } catch (error) {
            // Si hay un error en el proceso de eliminación, mostramos un mensaje de error.
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: error.message,
            });
        }
    };

    // Función que actualiza la interfaz con las solicitudes del usuario.
    const updateUIForRequests = async () => {
        const pendingRequests = await getPendingRequests(); // Obtenemos las solicitudes pendientes.
        const approvedDeniedRequests = await getApprovedDeniedRequests(); // Obtenemos las solicitudes aprobadas o denegadas.

        // Limpiamos los contenedores para evitar duplicados.
        requestUserPending.innerHTML = '';
        requestUserContainer.innerHTML = '';

        // Si no hay solicitudes pendientes, mostramos un mensaje al usuario.
        if (pendingRequests.length === 0) {
            requestUserPending.innerHTML = '<p>No tienes solicitudes pendientes.</p>';
        } else {
            // Si hay solicitudes pendientes, las mostramos.
            pendingRequests.forEach(request => {
                requestUserPending.innerHTML += `
                    <div>
                        <p><strong>Usuario:</strong> ${userId}</p>
                        <p><strong>Fecha de salida:</strong> ${request.departureDate}</p>
                        <p><strong>Fecha de regreso:</strong> ${request.returnDate}</p>
                        <p><strong>Código de computadora:</strong> ${request.computerCode}</p>
                        <p><strong>Aceptar términos:</strong> ${request.termsCheckbox ? 'Sí' : 'No'}</p>
                        <p><strong>Status:</strong> ${request.status}</p>
                        <p><strong>Sede:</strong> ${request.headquarters}</p>
                        <button class="delete-request-button" data-request-id="${request.id}">Eliminar solicitud</button>
                        <hr />
                    </div>
                `;
            });
        }

        // Si no hay solicitudes aprobadas o denegadas, mostramos un mensaje al usuario.
        if (approvedDeniedRequests.length === 0) {
            requestUserContainer.innerHTML = '<p>No tienes solicitudes aprobadas o denegadas.</p>';
        } else {
            // Si hay solicitudes aprobadas o denegadas, las mostramos.
            approvedDeniedRequests.forEach(request => {
                requestUserContainer.innerHTML += `
                    <div>
                        <p><strong>Usuario:</strong> ${userId}</p>
                        <p><strong>Fecha de salida:</strong> ${request.departureDate}</p>
                        <p><strong>Fecha de regreso:</strong> ${request.returnDate}</p>
                        <p><strong>Código de computadora:</strong> ${request.computerCode}</p>
                        <p><strong>Aceptar términos:</strong> ${request.termsCheckbox ? 'Sí' : 'No'}</p>
                        <p><strong>Status:</strong> ${request.status}</p>
                        <p><strong>Sede:</strong> ${request.headquarters}</p>
                        ${request.status !== 'Pendiente' ? `<p><strong>Administrador que revisó:</strong> ${request.adminId || 'No asignado'}</p>` : ''}
                        <hr />
                    </div>
                `;
            });
        }

        // Añadimos un evento para eliminar solicitudes cuando se hace click en el botón de eliminar.
        const deleteButtons = document.querySelectorAll('.delete-request-button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const requestId = button.getAttribute('data-request-id'); // Obtenemos el ID de la solicitud.
                deleteRequest(requestId); // Llamamos a la función para eliminar la solicitud.
            });
        });
    };

    // Llamamos a la función para actualizar la interfaz con las solicitudes.
    updateUIForRequests();

    // Función que valida las fechas (la de salida no puede ser posterior a la de regreso).
    const validateDates = () => {
        const departureDate = new Date(departureDateInput.value);
        const returnDate = new Date(returnDateInput.value);

        if (departureDate >= returnDate) {
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'La fecha de salida no puede ser posterior a la fecha de regreso.',
            });
            submitRequestButton.disabled = true; // Deshabilitamos el botón de enviar si la validación no es correcta.
        } else {
            submitRequestButton.disabled = false; // Habilitamos el botón si la validación es correcta.
        }
    };

    // Añadimos un evento para validar las fechas cuando cambien.
    departureDateInput.addEventListener('change', validateDates);
    returnDateInput.addEventListener('change', validateDates);

    // Evento para enviar la solicitud cuando se haga click en el botón.
    submitRequestButton.addEventListener('click', async (event) => {
        event.preventDefault(); // Evitamos el comportamiento predeterminado del formulario.

        // Obtenemos los datos del formulario.
        const departureDate = departureDateInput.value;
        const returnDate = returnDateInput.value;
        const computerCode = computerCodeInput.value;
        const termsCheckbox = termsCheckboxInput.checked;
        const selectedHeadquarters = headquarterSelect.value; // Obtenemos la sede seleccionada.
       
        // Mapeamos las sedes para obtener su nombre completo.
        const headquartersMap = {
            "SJ": "San Jose",
            "AL": "Alajuela",
            "HE": "Heredia",
            "PU": "Puntarenas",
            "GU": "Guanacaste",
            "LI": "Limon",
            "CA": "Cartago"
        };
        const fullHeadquarterName = headquartersMap[selectedHeadquarters]; // Obtenemos el nombre completo de la sede.

        // Validamos que todos los campos estén completos antes de enviar.
        if (!departureDate || !returnDate || !computerCode || !termsCheckbox || !selectedHeadquarters) {
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'Por favor, complete todos los campos del formulario.',
            });
            return; // Si falta algún campo, detenemos la ejecución.
        }

        // Preparamos los datos para enviar la solicitud.
        const requestData = {
            userId: userId,
            departureDate,
            returnDate,
            computerCode,
            termsCheckbox,
            headquarters: fullHeadquarterName, // Usamos el nombre completo de la sede.
            status: 'Pendiente',
        };

        // Intentamos enviar la solicitud a la API.
        try {
            const response = await fetch('http://localhost:3001/requests', {
                method: 'POST', // Usamos el método POST para enviar la solicitud.
                headers: {
                    'Content-Type': 'application/json', // Indicamos que los datos están en formato JSON.
                },
                body: JSON.stringify(requestData), // Convertimos los datos a JSON y los enviamos.
            });

            if (response.ok) {
                // Si la solicitud se envió correctamente, mostramos un mensaje de éxito.
                Swal.fire({
                    icon: 'success',
                    title: '¡Solicitud enviada!',
                    text: 'Tu solicitud ha sido registrada y está pendiente de revisión.',
                });

                updateUIForRequests(); // Actualizamos la interfaz para mostrar la nueva solicitud.
            } else {
                // Si hubo un error al enviar la solicitud, mostramos un mensaje de error.
                throw new Error('Hubo un problema al guardar la solicitud.');
            }
        } catch (error) {
            // Si ocurrió un error en la solicitud, mostramos el mensaje correspondiente.
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: error.message,
            });
        }
    });
});