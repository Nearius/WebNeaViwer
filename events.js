// events.js
// Este archivo será responsable de gestionar los eventos que ocurren en la página.

import { cargarDatosMapa, datosMapaSeleccionado, actualizarTablaColores } from './data.js';
import { mostrarModalDino, reAplicarEventos } from './ui.js';

// Evento principal para inicializar los eventos al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    const botonesmapa = document.querySelectorAll('.mapa-btn');
    const botonesmenuDinostamed = document.querySelectorAll('.menudinostamed');
    const tablas = document.querySelectorAll('.tabla-contenido');

    // Configuración de botones para seleccionar el mapa en la página de dinos tameados
    botonesmapa.forEach((boton, index) => {
        boton.addEventListener('click', () => {
            botonesmapa.forEach(btn => btn.classList.remove('seleccionado-1', 'seleccionado-2', 'seleccionado-3', 'seleccionado-4'));
            boton.classList.add(`seleccionado-${index + 1}`);
            const mapaSeleccionado = boton.getAttribute('data-section');
            if (mapaSeleccionado) {
                cargarDatosMapa(mapaSeleccionado);
            } else {
                console.error('Mapa seleccionado no es válido.');
            }
        });
    });

    // Configuración de botones del menú para mostrar la tabla correspondiente
    botonesmenuDinostamed.forEach((boton, index) => {
        boton.addEventListener('click', () => {
            botonesmenuDinostamed.forEach(btn => btn.classList.remove('seleccionado-1', 'seleccionado-2', 'seleccionado-3', 'seleccionado-4'));
            boton.classList.add(`seleccionado-${index + 1}`);
            const section = boton.getAttribute('data-section');
            tablas.forEach(tabla => tabla.style.display = 'none');
            const tablaAMostrar = document.querySelector(`.tabla-contenido[data-section="${section}"]`);
            if (tablaAMostrar) {
                tablaAMostrar.style.display = 'block';
                if (section === "colores") {
                    if (Array.isArray(datosMapaSeleccionado) && datosMapaSeleccionado.length > 0) {
                        actualizarTablaColores(datosMapaSeleccionado);
                    } else {
                        console.error('No hay datos cargados para el mapa seleccionado o los datos no son válidos.');
                    }
                }
            }
        });
    });

    // Evento para copia al portapapeles
    document.addEventListener('click', function(event) {
        if (event.target.tagName === 'TD') {
            copiarAlPortapapeles(event.target);
        }
    });

    // Evento para mostrar/ocultar el filtro
    document.getElementById('boton-filtro').addEventListener('click', function() {
        const filtroTabla = document.getElementById('filtro-tabla');
        filtroTabla.style.display = filtroTabla.style.display === 'none' ? 'block' : 'none';
    });

    // Evento para filtrar la tabla activa
    document.getElementById('buscar').addEventListener('input', function() {
        const filtro = this.value.toLowerCase();
        const tablaActiva = document.querySelector('.tabla-contenido:not([style*="display: none"]) table tbody');

        if (tablaActiva) {
            tablaActiva.querySelectorAll('tr').forEach(fila => {
                fila.style.display = fila.textContent.toLowerCase().includes(filtro) ? '' : 'none';
            });
        }
    });
});

// Función para copiar al portapapeles
function copiarAlPortapapeles(celda) {
    const texto = celda.textContent;
    navigator.clipboard.writeText(texto)
        .then(() => {
            console.log(`Texto copiado: ${texto}`);
            celda.classList.add('copiado');

            const mensaje = document.createElement('div');
            mensaje.classList.add('mensaje-copiado');
            mensaje.textContent = '¡Copiado!';
            document.body.appendChild(mensaje);
            
            const rect = celda.getBoundingClientRect();
            mensaje.style.top = `${rect.top + window.scrollY - 30}px`;
            mensaje.style.left = `${rect.left + window.scrollX}px`;
            
            setTimeout(() => mensaje.classList.add('visible'), 10);
            
            setTimeout(() => {
                mensaje.classList.remove('visible');
                celda.classList.remove('copiado');
                document.body.classList.remove('no-hover');
                mensaje.remove();
            }, 2000);

            document.body.classList.add('no-hover');
        })
        .catch(err => console.error('Error al copiar al portapapeles:', err));
} 
