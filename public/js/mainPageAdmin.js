document.addEventListener('DOMContentLoaded', async () => {
    let allRequests = [];

    // Función principal para inicializar el sistema y cargar datos
    const init = async () => {
        // Se obtienen las solicitudes desde el servidor
        const requests = await fetchRequests();
        allRequests = [...requests]; // Guardamos todas las solicitudes en una variable global
        const adminId = localStorage.getItem('adminId'); // Recuperamos el ID del administrador desde el almacenamiento local

        // Si no se encuentra el ID del administrador, mostramos un mensaje y redirigimos a la página de login
        if (!adminId) {
            Swal.fire({
                icon: 'warning',
                title: 'No se encontró el ID de administrador',
                text: 'Redirigiendo a la página de login...',
            }).then(() => {
                window.location.href = '/pages/loginPage.html';
            });
            return; // Terminamos la ejecución si no hay un ID de administrador
        } else {
            // Si el ID de administrador está disponible, lo mostramos en la interfaz de usuario
            document.getElementById('adminName').textContent = `Administrador: ${adminId}`;
        }

        // Si se obtuvieron solicitudes, actualizamos las listas y estadísticas
        if (requests) {
            updatePendingRequestsList(allRequests); // Actualiza la lista de solicitudes pendientes
            updateStatistics(allRequests); // Actualiza las estadísticas
            updateHistory(allRequests, adminId); // Actualiza el historial de solicitudes
        }
    };

    // Función para obtener todas las solicitudes desde el servidor
    const fetchRequests = async () => {
        try {
            const response = await fetch('http://localhost:3001/requests'); // Realizamos una solicitud GET al servidor
            if (!response.ok) throw new Error('No se pudieron obtener las solicitudes');
            const data = await response.json(); // Convertimos la respuesta a formato JSON
            console.log('Solicitudes obtenidas:', data); // Mostramos las solicitudes obtenidas
            return data; // Devolvemos las solicitudes
        } catch (error) {
            console.error('Error al obtener las solicitudes:', error); // Si ocurre un error, lo mostramos en consola
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar solicitudes',
                text: error.message,
            });
            return []; // En caso de error, devolvemos un array vacío
        }
    };

    // Función para actualizar la lista de solicitudes pendientes
    const updatePendingRequestsList = (requests) => {
        const pendingRequestsList = document.getElementById('pendingRequestsList');
        pendingRequestsList.innerHTML = ''; // Limpiamos la lista antes de agregar nuevas solicitudes
        const pendingRequests = requests.filter(request => request.status === 'Pendiente'); // Filtramos las solicitudes pendientes

        // Si no hay solicitudes pendientes, mostramos un mensaje indicándolo
        if (pendingRequests.length === 0) {
            const noRequestsMessage = document.createElement('p');
            noRequestsMessage.textContent = 'No hay solicitudes pendientes.';
            pendingRequestsList.appendChild(noRequestsMessage);
            return;
        }

        // Si hay solicitudes pendientes, las agregamos a la lista en la interfaz
        pendingRequests.forEach(request => {
            const listItem = document.createElement('li');
            listItem.classList.add('request-item'); // Clase para el item de la solicitud
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
            pendingRequestsList.appendChild(listItem); // Añadimos cada solicitud a la lista
        });
    };

    // Función para manejar la actualización del estado de las solicitudes
    const updateRequestStatus = async (requestId, action) => {
        try {
            const response = await fetch(`http://localhost:3001/requests/${requestId}`, {
                method: 'PATCH', // Realizamos una solicitud PATCH para actualizar el estado de la solicitud
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: action }), // Enviamos el nuevo estado de la solicitud
            });

            if (!response.ok) throw new Error('Error al actualizar el estado de la solicitud');
            const updatedRequest = await response.json(); // Convertimos la respuesta a formato JSON
            console.log('Solicitud actualizada:', updatedRequest);

            // Actualizamos el estado de la solicitud en el arreglo allRequests
            allRequests = allRequests.map(request => 
                request.id === updatedRequest.id ? updatedRequest : request
            );

            // Actualizamos las listas de solicitudes y las estadísticas
            updatePendingRequestsList(allRequests);
            updateStatistics(allRequests);
        } catch (error) {
            console.error('Error al actualizar la solicitud:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        }
    };

    // Función para actualizar las estadísticas de solicitudes
    const updateStatistics = (requests) => {
        const totalRequests = document.getElementById('totalRequests');
        const requestsPerStudent = document.getElementById('requestsPerStudent');

        const total = requests.length; // Número total de solicitudes
        const statusCount = {
            'Pendiente': 0,
            'Aprobada': 0,
            'Denegada': 0
        };

        // Calculamos la cantidad de solicitudes por cada estudiante y el estado de cada solicitud
        const perStudent = requests.reduce((acc, request) => {
            statusCount[request.status] = (statusCount[request.status] || 0) + 1;

            if (!acc[request.userId]) {
                acc[request.userId] = {
                    requests: [],
                    totalRequests: 0,
                    totalApproved: 0,
                    totalDenied: 0
                };
            }
            acc[request.userId].requests.push(request);
            acc[request.userId].totalRequests += 1;
            if (request.status === 'Aprobada') acc[request.userId].totalApproved += 1;
            if (request.status === 'Denegada') acc[request.userId].totalDenied += 1;

            return acc;
        }, {});

        // Actualizamos la interfaz con el número total de solicitudes
        totalRequests.textContent = `Total de solicitudes: ${total}`;

        // Limpiamos la lista de solicitudes por estudiante antes de agregar nuevas
        requestsPerStudent.innerHTML = '';
        Object.entries(perStudent).forEach(([userId, data]) => {
            const li = document.createElement('li');
            li.classList.add('student-request-item'); // Clase para el item de solicitudes por estudiante
            li.innerHTML = `Usuario: ${userId} | Total solicitudes: ${data.totalRequests} | Aprobadas: ${data.totalApproved} | Denegadas: ${data.totalDenied}`;
            data.requests.forEach(request => {
                li.innerHTML += `
                    <ul class="request-details">
                        <li>Fecha de salida: ${request.departureDate}</li>
                        <li>Fecha de regreso: ${request.returnDate}</li>
                        <li>Sede: ${request.headquarters}</li>
                        <li>Estado: ${request.status}</li>
                        <li>Administrador: ${request.adminId || 'No asignado'}</li>
                    </ul>
                `;
            });

            requestsPerStudent.appendChild(li); // Añadimos la información de cada estudiante
        });

        // Mostramos la cantidad de solicitudes por estado
        const statusList = document.createElement('ul');
        statusList.classList.add('status-list');
        Object.entries(statusCount).forEach(([status, count]) => {
            const statusItem = document.createElement('li');
            statusItem.textContent = `${status}: ${count}`;
            statusList.appendChild(statusItem);
        });

        totalRequests.appendChild(statusList); // Añadimos la lista de estados
    };

    // Función para actualizar el historial de solicitudes de este administrador
    const updateHistory = (requests, adminId) => {
        const currentAdminRequests = document.getElementById('currentAdminList');
        const otherAdminsRequests = document.getElementById('otherAdminList');

        currentAdminRequests.innerHTML = '';
        otherAdminsRequests.innerHTML = '';

        // Filtramos las solicitudes según el ID del administrador actual
        const currentAdminRequestsList = requests.filter(request => request.adminId === adminId);
        const otherAdminsRequestsList = requests.filter(request => request.adminId !== adminId);

        // Mostramos las solicitudes gestionadas por este administrador
        currentAdminRequestsList.forEach(request => {
            const listItem = document.createElement('li');
            listItem.classList.add('history-item');
            listItem.textContent = `Usuario: ${request.userId} | Fecha de salida: ${request.departureDate} | Fecha de regreso: ${request.returnDate}`;
            currentAdminRequests.appendChild(listItem);
        });

        // Mostramos las solicitudes gestionadas por otros administradores
        otherAdminsRequestsList.forEach(request => {
            const listItem = document.createElement('li');
            listItem.classList.add('history-item');
            listItem.textContent = `Usuario: ${request.userId} | Fecha de salida: ${request.departureDate} | Fecha de regreso: ${request.returnDate} | Administrador: ${request.adminId}`;
            otherAdminsRequests.appendChild(listItem);
        });
    };

    // Configuramos los event listeners para manejar los clics en los botones de aprobación y denegación
    const setupEventListeners = () => {
        document.body.addEventListener('click', async (event) => {
            if (event.target.classList.contains('approveBtn') || event.target.classList.contains('denyBtn')) {
                const requestId = event.target.dataset.id;
                const action = event.target.classList.contains('approveBtn') ? 'Aprobada' : 'Denegada';
                await updateRequestStatus(requestId, action); // Actualizamos el estado de la solicitud
            }
        });
    };

    // Inicialización
    init(); // Ejecutamos la función de inicialización
    setupEventListeners(); // Configuramos los event listeners
});