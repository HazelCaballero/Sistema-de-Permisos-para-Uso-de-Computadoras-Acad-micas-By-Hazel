// Cuando el contenido del DOM está completamente cargado, se ejecuta este bloque de código.
document.addEventListener('DOMContentLoaded', async () => {
    // Obtengo los elementos del DOM que necesito manipular
    const adminNameElement = document.getElementById('adminName');
    const totalRequests = document.getElementById('totalRequests');
    const requestsPerUser = document.getElementById('requestsPerUser');
    const requestsByStatus = document.getElementById('requestsByStatus');
    const requestsByHeadquarters = document.getElementById('requestsByHeadquarters');
    const keywordSearch = document.getElementById('keywordSearch');
    const btnSearch = document.getElementById('btnSearch');
    const btnSearchRestart = document.getElementById('btnSearchRestart');
    const requestUserContainer = document.getElementById('requestUserContainer');
    const searchResultsContainer = document.getElementById('searchResults');
    
    // Obtengo el ID del administrador desde el almacenamiento local
    const adminId = localStorage.getItem('adminId');
    
    // Si no encuentro el ID de administrador, redirijo al login
    if (!adminId) {
        alert('No se encontró el ID de administrador. Redirigiendo a login...');
        window.location.href = '/pages/loginPage.html';
    } else {
        // Si el ID existe, actualizo el nombre del administrador en la interfaz
        adminNameElement.textContent = `Administrador: ${adminId}`;
    }

    // Función asincrónica para obtener todas las solicitudes del servidor
    const fetchRequests = async () => {
        try {
            const response = await fetch('http://localhost:3001/requests');
            const data = await response.json();
            return data; // Retorno las solicitudes obtenidas
        } catch (error) {
            // En caso de error, imprimo el error en la consola y retorno un arreglo vacío
            console.error('Error al obtener las solicitudes:', error);
            return [];
        }
    };

    // Función para actualizar las estadísticas de las solicitudes
    const updateStatistics = (requests) => {
        // Muestra el total de solicitudes
        totalRequests.textContent = requests.length;

        // Calcula cuántas solicitudes tiene cada usuario
        const requestsByUser = requests.reduce((acc, request) => {
            acc[request.userId] = (acc[request.userId] || 0) + 1;
            return acc;
        }, {});
        // Actualiza el contenedor de solicitudes por usuario
        requestsPerUser.innerHTML = '';
        for (let userId in requestsByUser) {
            requestsPerUser.innerHTML += `<p class="user-request-item">Usuario ${userId}: ${requestsByUser[userId]} solicitudes</p>`;
        }

        // Calcula el número de solicitudes por estado (Pendiente, Aprobada, Denegada)
        const statusCounts = requests.reduce((acc, request) => {
            acc[request.status] = (acc[request.status] || 0) + 1;
            return acc;
        }, {});
        // Actualiza el contenedor de solicitudes por estado
        requestsByStatus.innerHTML = `
            <p class="status-count">Pendientes: ${statusCounts['Pendiente'] || 0}</p>
            <p class="status-count">Aprobadas: ${statusCounts['Aprobada'] || 0}</p>
            <p class="status-count">Denegadas: ${statusCounts['Denegada'] || 0}</p>
        `;

        // Calcula cuántas solicitudes hay por cada sede
        const headquartersCounts = requests.reduce((acc, request) => {
            acc[request.headquarters] = (acc[request.headquarters] || 0) + 1;
            return acc;
        }, {});
        // Actualiza el contenedor de solicitudes por sede
        requestsByHeadquarters.innerHTML = '';
        for (let headquarters in headquartersCounts) {
            requestsByHeadquarters.innerHTML += `<p class="headquarters-count">Sede ${headquarters}: ${headquartersCounts[headquarters]} solicitudes</p>`;
        }
    };

    // Función para realizar la búsqueda de solicitudes basadas en palabras clave
    const searchRequests = (requests) => {
        const keyword = keywordSearch.value.toLowerCase().trim();
        if (!keyword) return requests; // Si no hay palabra clave, retorno todas las solicitudes

        // Filtra las solicitudes que coincidan con la palabra clave
        return requests.filter(request => {
            return request.userId.toString().toLowerCase().includes(keyword) ||
                   request.departureDate.toLowerCase().includes(keyword) ||
                   request.returnDate.toLowerCase().includes(keyword) ||
                   request.headquarters.toLowerCase().includes(keyword) ||
                   request.status.toLowerCase().includes(keyword);
        });
    };

    // Función para mostrar los resultados de búsqueda
    const displaySearchResults = (filteredRequests) => {
        searchResultsContainer.innerHTML = ''; // Limpiar resultados anteriores
        if (filteredRequests.length === 0) {
            // Si no hay resultados, muestro un mensaje
            const noResultsMessage = document.createElement('p');
            noResultsMessage.classList.add('no-results-message'); // Clase añadida
            noResultsMessage.textContent = 'No se encontraron resultados que coincidan con la búsqueda.';
            searchResultsContainer.appendChild(noResultsMessage);
        } else {
            // Si hay resultados, los muestro en el contenedor de resultados
            filteredRequests.forEach(request => {
                const requestItem = document.createElement('div');
                requestItem.classList.add('request-item', 'search-result-item'); // Clases añadidas
                requestItem.innerHTML = `
                    <div class="request-details">
                        <p><strong>Usuario:</strong> ${request.userId}</p>
                        <p><strong>Fecha de salida:</strong> ${request.departureDate}</p>
                        <p><strong>Fecha de regreso:</strong> ${request.returnDate}</p>
                        <p><strong>Sede:</strong> ${request.headquarters}</p>
                        <p><strong>Estado:</strong> ${request.status}</p>
                    </div>
                `;
                searchResultsContainer.appendChild(requestItem);
            });
        }
    };

    // Función para mostrar todas las solicitudes (sin filtros)
    const displayRequests = (requests) => {
        requestUserContainer.innerHTML = ''; // Limpiar solicitudes previas
        requests.forEach(request => {
            const requestItem = document.createElement('div');
            requestItem.classList.add('request-item', 'historical-request-item'); // Clases añadidas
            requestItem.innerHTML = `
                <div class="request-details">
                    <p><strong>Usuario:</strong> ${request.userId}</p>
                    <p><strong>Fecha de salida:</strong> ${request.departureDate}</p>
                    <p><strong>Fecha de regreso:</strong> ${request.returnDate}</p>
                    <p><strong>Sede:</strong> ${request.headquarters}</p>
                    <p><strong>Estado:</strong> ${request.status}</p>
                </div>
            `;
            requestUserContainer.appendChild(requestItem);
        });
    };

    // Obtengo todas las solicitudes y luego actualizo las estadísticas y muestro las solicitudes
    const requests = await fetchRequests();
    updateStatistics(requests);
    displayRequests(requests);

    // Manejo de la búsqueda
    btnSearch.addEventListener('click', () => {
        const filteredRequests = searchRequests(requests);
        displaySearchResults(filteredRequests);
    });

    // Manejo del reinicio de búsqueda
    btnSearchRestart.addEventListener('click', () => {
        keywordSearch.value = ''; // Limpiar el campo de búsqueda
        displayRequests(requests); // Volver a mostrar todas las solicitudes
        updateStatistics(requests); // Actualizar las estadísticas
        searchResultsContainer.innerHTML = ''; // Limpiar resultados de búsqueda
    });
});