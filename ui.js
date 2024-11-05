// ui.js
// Este archivo contendrá la lógica relacionada con la interfaz de usuario (mostrar tablas, modales, etc).

export function mostrarModalDino(dino) {
    const modal = document.getElementById('modal-dino');
    const infoDinoDiv = document.getElementById('info-dino');
    
    infoDinoDiv.innerHTML = `
        <p><strong style="color: black;">Nombre:</strong> ${dino.name || 'Sin nombre'}</p>
        <p><strong style="color: black;">Especie:</strong> ${dino.creature || 'Desconocido'}</p>
        <p><strong style="color: black;">ID del Dino:</strong> ${dino.dinoid || 'No disponible'}</p>
        <p><strong style="color: black;">Mutaciones (Padre):</strong> ${dino['mut-f'] || 0}</p>
        <p><strong style="color: black;">Mutaciones (Madre):</strong> ${dino['mut-m'] || 0}</p>
        <p><strong style="color: black;">Castrado:</strong> ${dino.isNeutered ? 'Sí' : 'No'}</p>
        
        <h3 style="color:black">Estadísticas del Dino</h3>
        <table class="stats-table">
            <thead>
                <tr>
                    <th>Stat</th>
                    <th>Base</th>
                    <th>Añadidos</th>
                    <th>Mutaciones</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>HP</td>
                    <td>${dino['hp-w'] || 0}</td>
                    <td>${dino['hp-t'] || 0}</td>
                    <td>${dino['hp-m'] || 0}</td>
                    <td>${(dino['hp-w'] || 0) + (dino['hp-t'] || 0) + (dino['hp-m'] || 0)}</td>
                </tr>
                <!-- Agregar más filas para otros stats -->
            </tbody>
        </table>
    `;
    modal.style.display = 'block';

    modal.querySelector('.cerrar-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
}

export function reAplicarEventos() {
    // Re-aplicar eventos para los botones "Stats" y los nombres de los dinos
    document.querySelectorAll('.stats-btn').forEach(statsBtn => {
        statsBtn.addEventListener('click', () => {
            const dinoData = JSON.parse(statsBtn.getAttribute('data-dino'));
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
