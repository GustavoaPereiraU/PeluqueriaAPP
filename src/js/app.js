
document.addEventListener('DOMContentLoaded', function(){
    iniciarApp()
});

function iniciarApp(){
    mostrarServicios()
}   

async function mostrarServicios(){
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();

        const { servicios } = db;

        //Generar HTML
        servicios.forEach(servicio => {

            //DOM Scripting
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = servicio.nombre;

            console.log(nombreServicio);
        })
    } catch (error) {
        console.log(error);
    }
}