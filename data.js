
// Este archivo contendrá la lógica para la carga de datos desde la API.


export let datosMapaSeleccionado = []; // Variable global para almacenar los datos del mapa seleccionado
let config = {};

// Obtener la configuración del backend s 
async function cargarConfiguracion() {
    try {
        const response = await fetch('http://localhost:8885/api/config');
        if (!response.ok) {
            throw new Error(`Error al cargar la configuración: ${response.statusText}`);
        }
        config = await response.json();
        console.log('Configuración cargada:', config);

        if (!config.apiUrl) {
            console.error('apiUrl no está definido en la configuración.');
        }
    } catch (error) {
        console.error('Error al cargar la configuración:', error);
    }
}

// Llamar a cargarConfiguracion y luego continuar con otras operaciones
async function iniciar() {
    await cargarConfiguracion();  // Esperar a que la configuración se cargue

    // Aquí puedes cargar los datos iniciales del mapa, si es necesario
    // Por ejemplo, cargarDatosMapa('island'); si deseas cargar automáticamente un mapa por defecto
}

// Iniciar la configuración al cargar el script
iniciar();

// Función para cargar los datos del mapa seleccionado
export async function cargarDatosMapa(mapa) {
    if (!config.apiUrl) {
        console.error('No se puede cargar los datos del mapa porque apiUrl no está definido.');
        return;
    }

    const API_URLS = {
        island: `${config.apiUrl}/api/island`,
        scorched: `${config.apiUrl}/api/scorched`,
        center: `${config.apiUrl}/api/center`,
        aberration: `${config.apiUrl}/api/aberration`
    };

    const url = API_URLS[mapa];
    if (!url) {
        console.error('El mapa seleccionado no tiene una URL configurada.');
        return;
    }

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': config.apiKey // Incluye la API key obtenida de la configuración (si es necesario)
            }
        });
        if (!response.ok) {
            throw new Error(`Error al cargar los datos desde la API: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Datos JSON cargados:', data);

        // Validar que los datos sean un array antes de asignarlos
        if (Array.isArray(data.data)) {
            datosMapaSeleccionado = data.data; // Accede al arreglo que está en data.data
            actualizarTabla(datosMapaSeleccionado);
        } else {
            console.error('Los datos cargados no son un array válido:', data);
        }
    } catch (error) {
        alert('Error al cargar los datos. Inténtalo más tarde.');
        console.error('Error al cargar los datos desde la API:', error);
    }
}
// Función para actualizar la tabla con los datos cargados
export function actualizarTabla(datos) {
    console.log('Datos de criaturas para mostrar en la tabla:', datos);
    const tbody = document.querySelector('.tabla-contenido[data-section="general"] tbody');
    if (!tbody) {
        console.error('No se encontró la tabla para actualizar.');
        return;
    }
    tbody.innerHTML = '';

    datos.forEach(item => {
        const fila = document.createElement('tr');

        // Crear las celdas una por una
        const celdas = [
            item.tribeid || '',
            item.name || 'Sin nombre',
            item.creature || ''
        ];

        // Agregar las celdas básicas al inicio
        celdas.forEach(contenido => {
            const celda = document.createElement('td');
            celda.textContent = contenido;
            fila.appendChild(celda);
        });

        // Crear la celda con el botón y añadirlo en la posición correcta
        const statsCelda = document.createElement('td');
        const statsBtn = document.createElement('button');
        statsBtn.classList.add('btn-stats');
        statsBtn.textContent = '+';
        statsBtn.setAttribute('data-dino', JSON.stringify(item)); // Añadir data-dino al botón
        statsCelda.classList.add('stats-btn');
        statsCelda.appendChild(statsBtn);
        fila.appendChild(statsCelda);

        // Añadir evento al botón de stats para abrir el modal
        statsBtn.addEventListener('click', () => {
            const dinoData = JSON.parse(statsBtn.getAttribute('data-dino'));
            mostrarModalDino(dinoData);
        });

        // Continuar agregando el resto de las celdas
        const otrasCeldas = [
            item.lvl || '',
            item.sex || '',
            item.lat ? item.lat.toFixed(2) : '',
            item.lon ? item.lon.toFixed(2) : '',
            item.cryo ? 'Sí' : 'No',
            item.ccc || ''
        ];

        otrasCeldas.forEach(contenido => {
            const celda = document.createElement('td');
            celda.textContent = contenido;
            fila.appendChild(celda);
        });

        // Añadir la fila completa al tbody
        tbody.appendChild(fila);
    });

    // Añadir evento a los nombres de los dinos para abrir la modal
    document.querySelectorAll('.nombre-dino').forEach(nombreDino => {
        nombreDino.addEventListener('click', () => {
            const dinoData = JSON.parse(nombreDino.getAttribute('data-dino'));
            mostrarModalDino(dinoData);
        });
    });
}


export function mostrarModalDino(dino) {
    const modal = document.getElementById('modal-dino');
    const infoDinoDiv = document.getElementById('info-dino');
    
    // Limpiar el contenido existente antes de agregar nueva información
    infoDinoDiv.innerHTML = '';

    // Crear y añadir los elementos de manera segura
    const elementosInfo = [
        { label: 'Nombre', value: dino.name || 'Sin nombre' },
        { label: 'Especie', value: dino.creature || 'Desconocido' },
        { label: 'ID del Dino', value: dino.dinoid || 'No disponible' },
        { label: 'Tribu', value: dino.tribeid || 'No disponible' },
        { label: 'Nivel', value: dino.lvl || 'No disponible' },
        { label: 'Sexo', value: dino.sex || 'Desconocido' },
        { label: 'Latitud', value: dino.lat ? dino.lat.toFixed(2) : 'No disponible' },
        { label: 'Longitud', value: dino.lon ? dino.lon.toFixed(2) : 'No disponible' },
        { label: 'Castrado', value: dino.isNeutered ? 'Sí' : 'No' },
        { label: 'Criogenizado', value: dino.cryo ? 'Sí' : 'No' },
        { label: 'Código CCC', value: dino.ccc || 'No disponible' },
        { label: 'Mutaciones (Padre)', value: dino['mut-f'] || 0 },
        { label: 'Mutaciones (Madre)', value: dino['mut-m'] || 0 }
    ];

    elementosInfo.forEach(item => {
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.style.color = 'black';
        strong.textContent = `${item.label}: `;
        p.appendChild(strong);
        p.appendChild(document.createTextNode(item.value));
        infoDinoDiv.appendChild(p);
    });

    // Añadir título de estadísticas
    const h3 = document.createElement('h3');
    h3.style.color = 'black';
    h3.textContent = 'Estadísticas del Dino';
    infoDinoDiv.appendChild(h3);

    // Crear la tabla de estadísticas
    const table = document.createElement('table');
    table.classList.add('stats-table');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Stat', 'Base', 'Añadidos', 'Mutaciones', 'Total'].forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const stats = ['hp', 'stam', 'oxy', 'food', 'weight', 'melee', 'speed', 'fortitude', 'crafting'];

    stats.forEach(stat => {
        const statsRow = document.createElement('tr');
        const base = dino[`${stat}-w`] || 0;
        const added = dino[`${stat}-t`] || 0;
        const mutated = dino[`${stat}-m`] || 0;
        const total = base + added + mutated;

        const celdasStats = [
            stat,
            base,
            added,
            mutated,
            total
        ];

        celdasStats.forEach(statValue => {
            const td = document.createElement('td');
            td.textContent = statValue;
            statsRow.appendChild(td);
        });
        tbody.appendChild(statsRow);
    });
    table.appendChild(tbody);

    infoDinoDiv.appendChild(table);

    // Mostrar el modal y centrarlo
    modal.style.display = 'flex';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.overflowY = 'auto';

    // Cerrar el modal al hacer clic en el botón de cerrar
    modal.querySelector('.cerrar-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cerrar el modal al hacer clic fuera del contenido del modal
    modal.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
}



export function reAplicarEventos() {
    // Re-aplicar eventos para los botones "Stats" y los nombres de los dinos
    document.querySelectorAll('.stats-btn').forEach(statsBtn => {
        statsBtn.addEventListener('click', () => {
            const dinoData = JSON.parse(statsBtn.closest('td').getAttribute('data-dino'));
            mostrarModalDino(dinoData);
        });
    });

    document.querySelectorAll('.nombre-dino').forEach(nombreDino => {
        nombreDino.addEventListener('click', () => {
            const dinoData = JSON.parse(nombreDino.getAttribute('data-dino'));
            mostrarModalDino(dinoData);
        });
    });
}


    document.querySelectorAll('.nombre-dino').forEach(nombreDino => {
        nombreDino.addEventListener('click', () => {
            const dinoData = JSON.parse(nombreDino.getAttribute('data-dino'));
            mostrarModalDino(dinoData);
        });
    });



// Delegación de eventos para manejar clics en la tabla de contenido
const tablaContenido = document.querySelector('.tabla-contenido[data-section="general"]');
if (tablaContenido) {
    tablaContenido.addEventListener('click', function (event) {
        if (event.target.classList.contains('btn-stats')) {
            // Lógica para manejar el clic en el botón de stats
            console.log('Botón de stats clicado:', event.target);
        }
    });
} else {
    console.error('No se encontró la tabla de contenido para agregar el evento.');
}

// Función para actualizar la tabla de colores
export function actualizarTablaColores(datos) {
    const tbodyColores = document.querySelector('.tabla-contenido[data-section="colores"] tbody');
    if (!tbodyColores) {
        console.error('No se encontró la tabla de colores para actualizar.');
        return;
    }
    tbodyColores.innerHTML = '';
    datos.forEach(d => {
        const fila = document.createElement('tr');

        // Evitar el uso de innerHTML para prevenir XSS
        const celdas = [
            d.tribeid || '',
            d.name || 'Sin nombre',
            d.creature || '',
            d.lvl || ''
        ];

        celdas.forEach(contenido => {
            const celda = document.createElement('td');
            celda.textContent = contenido;
            fila.appendChild(celda);
        });

        for (let i = 0; i <= 5; i++) {
            const celdaColor = document.createElement('td');
            celdaColor.style.backgroundColor = colorMap[d[`c${i}`]] || '#FFF';
            celdaColor.textContent = d[`c${i}`] || '';
            fila.appendChild(celdaColor);
        }

        tbodyColores.appendChild(fila);
    });
}

const colorMap = {
    1: "#ff0000",
    2: "#0000ff",
    3: "#00ff00",
    4: "#ffff00",
    5: "#00ffff",
    6: "#ff00ff",
    7: "#c0ffba",
    8: "#c8caca",
    9: "#786759",
    10: "#ffb46c",
    11: "#fffa8a",
    12: "#ff756c",
    13: "#7b7b7b",
    14: "#3b3b3b",
    15: "#593a2a",
    16: "#224900",
    17: "#812118",
    18: "#ffffff",
    19: "#ffa8a8",
    20: "#592b2b",
    21: "#ffb694",
    22: "#88532f",
    23: "#cacaa0",
    24: "#94946c",
    25: "#e0ffe0",
    26: "#799479",
    27: "#224122",
    28: "#d9e0ff",
    29: "#394263",
    30: "#e4d9ff",
    31: "#403459",
    32: "#ffe0ba",
    33: "#948575",
    34: "#594e41",
    35: "#595959",
    36: "#ffffff",
    37: "#b79683",
    38: "#eadad5",
    39: "#d0a794",
    40: "#c3b39f",
    41: "#887666",
    42: "#a0664b",
    43: "#cb7956",
    44: "#bc4f00",
    45: "#79846c",
    46: "#909c79",
    47: "#a5a48b",
    48: "#74939c",
    49: "#787496",
    50: "#b0a2c0",
    51: "#6281a7",
    52: "#485c75",
    53: "#5fa4ea",
    54: "#4568d4",
    55: "#ededed",
    56: "#515151",
    57: "#184546",
    58: "#007060",
    59: "#00c5ab",
    60: "#40594c",
    61: "#3e4f40",
    62: "#3b3938",
    63: "#585554",
    64: "#9b9290",
    65: "#525b56",
    66: "#8aa196",
    67: "#e8b0ff",
    68: "#ff119a",
    69: "#730046",
    70: "#b70042",
    71: "#7e331e",
    72: "#a93000",
    73: "#ef3100",
    74: "#ff5834",
    75: "#ff7f00",
    76: "#ffa73a",
    77: "#ae7000",
    78: "#949427",
    79: "#171717",
    80: "#191d36",
    81: "#152b3a",
    82: "#302531",
    83: "#a8ff44",
    84: "#38e985",
    85: "#008840",
    86: "#0f552e",
    87: "#005b45",
    88: "#5b9725",
    89: "#5e275f",
    90: "#853587",
    91: "#bd77be",
    92: "#0e404a",
    93: "#105563",
    94: "#14849c",
    95: "#82a7ff",
    96: "#aceaff",
    97: "#505118",
    98: "#766e3f",
    99: "#c0bd5e",
    100: "#f4ffc0"
};
