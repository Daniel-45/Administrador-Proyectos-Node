import Swal from 'sweetalert2';

export const actualizarProgreso = () => {
    // Seleccionar las tareas del proyecto
    const tareas = document.querySelectorAll('li.tarea');

    if (tareas.length) {
        // Seleccionar tareas completadas
        const tareasCompletadas = document.querySelectorAll('i.completo');
        console.log(tareasCompletadas);

        // Calcular progreso
        const progreso = Math.round((tareasCompletadas.length / tareas.length) * 100);
        console.log(progreso);

        // Mostrar progreso
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = progreso + '%';

        if (progreso === 100) {
            Swal.fire({
                icon: 'success',
                title: 'Completado',
                text: 'Has completado este proyecto'
            })
        }
    }

}