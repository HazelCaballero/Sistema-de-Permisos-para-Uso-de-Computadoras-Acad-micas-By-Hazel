// Cuando el DOM está completamente cargado, inicio la ejecución de mi script
document.addEventListener('DOMContentLoaded', async () => {
    // Obtengo los elementos del DOM que voy a necesitar para mostrar la información
    const adminNameElement = document.getElementById('adminName');
    const pendingRequestsList = document.getElementById('pendingRequestsList');
    const totalRequests = document.getElementById('totalRequests');
    const requestsPerStudent = document.getElementById('requestsPerStudent');
    const requestUserContainer = document.getElementById('requestUserContainer');
    const keywordSearch = document.getElementById('keywordSearch');
    const btnSearch = document.getElementById('btnSearch');
    const btnSearchRestart = document.getElementById('btnSearchRestart');
   
    // Busco el ID del administrador en el localStorage
    const adminId = localStorage.getItem('adminId');
   
    // Si no encuentro el ID del administrador, lo redirijo a la página de login
    if (!adminId) {
        alert('No se encontró el ID de administrador. Redirigiendo a login...');
        window.location.href = '/pages/loginPage.html';
    } else {
        // Si encuentro el ID, lo muestro en la interfaz
        adminNameElement.textContent = `Administrador: ${adminId}`;
    }

    // Función para obtener todas las solicitudes desde la API
    const fetchRequests = async () => {
        try {
            // Realizo una petición GET para obtener las solicitudes
            const response = await fetch('http://localhost:3000/requests');
            const data = await response.json();
            console.log('Solicitudes obtenidas:', data); // Verifico en consola si obtuve correctamente las solicitudes
            return data;
        } catch (error) {
            // Si ocurre un error, lo muestro en consola
            console.error('Error al obtener las solicitudes:', error);
            return []; // Retorno un array vacío en caso de error
        }
    };

    // Función para actualizar la lista de solicitudes pendientes
    const updatePendingRequestsList = (requests) => {
        // Vacío la lista antes de agregar nuevos elementos
        pendingRequestsList.innerHTML = '';
       
        // Filtrar solo las solicitudes que están pendientes
        const pendingRequests = requests.filter(request => request.status === 'Pendiente');
       
        // Recorro cada solicitud pendiente y la agrego a la lista
        pendingRequests.forEach(request => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `    
                Usuario: ${request.userId} |
                Fecha de salida: ${request.departureDate} |
                Fecha de regreso: ${request.returnDate} |
                Estado: ${request.status} |
                Administrador: ${request.adminId || 'No asignado'} |
                Sede: ${request.headquarters}
                <button class="approveBtn" data-id="${request.id}">Aprobar</button>
                <button class="denyBtn" data-id="${request.id}">Denegar</button>
            `;
            pendingRequestsList.appendChild(listItem); // Agrego el elemento a la lista
        });
    };

    // Obtengo las solicitudes cuando se carga la página
    const requests = await fetchRequests();

    if (requests) {
        // Si obtuve las solicitudes correctamente, actualizo la lista
        updatePendingRequestsList(requests);

        // Verifico si existen resultados filtrados en localStorage al cargar la página
        const filteredRequestsFromStorage = JSON.parse(localStorage.getItem('filteredRequests'));

        // Si existen resultados filtrados en localStorage, los muestro
        if (filteredRequestsFromStorage && filteredRequestsFromStorage.length > 0) {
            console.log('Mostrando resultados de localStorage:', filteredRequestsFromStorage);
           
            // Recorro los resultados y los agrego a la interfaz
            filteredRequestsFromStorage.forEach(request => {
                const requestItem = document.createElement('div');
                requestItem.classList.add('request-item');
                requestItem.innerHTML = `
                    <p>Usuario: ${request.userId}</p>
                    <p>Fecha de salida: ${request.departureDate}</p>
                    <p>Fecha de regreso: ${request.returnDate}</p>
                    <p>Sede: ${request.headquarters}</p>
                    <p>Estado: ${request.status}</p>
                    <button class="deleteBtn" data-id="${request.id}">Eliminar</button>
                `;
                requestUserContainer.appendChild(requestItem);
            });
        } else {
            // Si no hay resultados filtrados en localStorage, muestro todas las solicitudes
            console.log('No se encontraron resultados filtrados en localStorage. Mostrando todos los resultados.');
            requests.forEach(request => {
                const requestItem = document.createElement('div');
                requestItem.classList.add('request-item');
                requestItem.innerHTML = `
                    <p>Usuario: ${request.userId}</p>
                    <p>Fecha de salida: ${request.departureDate}</p>
                    <p>Fecha de regreso: ${request.returnDate}</p>
                    <p>Sede: ${request.headquarters}</p>
                    <p>Estado: ${request.status}</p>
                `;
                requestUserContainer.appendChild(requestItem); // Agrego cada solicitud a la interfaz
            });
        }

        // Función de búsqueda global que se ejecuta cuando el botón de búsqueda es presionado
        btnSearch.addEventListener('click', () => {
            // Llamo a la función para filtrar las solicitudes
            const filteredRequests = searchRequests(requests);

            // Limpio la lista de resultados antes de agregar los nuevos
            requestUserContainer.innerHTML = '';

            if (filteredRequests.length > 0) {
                // Si hay resultados filtrados, los guardo en localStorage para mostrar más tarde
                localStorage.setItem('filteredRequests', JSON.stringify(filteredRequests));
                console.log('filteredRequests guardadas en localStorage:', filteredRequests);

                // Recorro las solicitudes filtradas y las muestro
                filteredRequests.forEach(request => {
                    const requestItem = document.createElement('div');
                    requestItem.classList.add('request-item');
                    requestItem.innerHTML = `
                        <p>Usuario: ${request.userId}</p>
                        <p>Fecha de salida: ${request.departureDate}</p>
                        <p>Fecha de regreso: ${request.returnDate}</p>
                        <p>Sede: ${request.headquarters}</p>
                        <p>Estado: ${request.status}</p>
                    `;
                    requestUserContainer.appendChild(requestItem); // Agrego la solicitud filtrada
                });
            } else {
                // Si no hay resultados, muestro un mensaje diciendo que no se encontraron coincidencias
                const noResultsMessage = document.createElement('p');
                noResultsMessage.textContent = 'No se encontraron solicitudes que coincidan con los criterios de búsqueda.';
                requestUserContainer.appendChild(noResultsMessage);
            }
        });

        // Función para reiniciar la búsqueda cuando se hace clic en el botón de reinicio
        btnSearchRestart.addEventListener('click', () => {
            console.log('Reiniciando búsqueda...');
            keywordSearch.value = ''; // Vacío el campo de búsqueda
            requestUserContainer.innerHTML = ''; // Limpio los resultados
            localStorage.removeItem('filteredRequests'); // Elimino los resultados filtrados guardados en localStorage

            // Verifico en consola que los resultados filtrados fueron eliminados
            console.log('filteredRequests después de eliminar:', localStorage.getItem('filteredRequests'));

            // Muestro todas las solicitudes nuevamente
            requests.forEach(request => {
                const requestItem = document.createElement('div');
                requestItem.classList.add('request-item');
                requestItem.innerHTML = `
                    <p>Usuario: ${request.userId}</p>
                    <p>Fecha de salida: ${request.departureDate}</p>
                    <p>Fecha de regreso: ${request.returnDate}</p>
                    <p>Sede: ${request.headquarters}</p>
                    <p>Estado: ${request.status}</p>
                `;
                requestUserContainer.appendChild(requestItem); // Vuelvo a agregar todas las solicitudes
            });
        });
    }
});
