
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
            const { id, nombre, precio } = servicio;
            //DOM Scripting
            //Generar Nombre
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            //Generar Precio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            //Generar Div contenedor de servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');


            //inyectar precio y nombre al div del servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            //Inyectarlo en HTML
            document.querySelector('#servicios').appendChild(servicioDiv); 
            
            //Selecciona un servicio para la cita
            servicioDiv.onclick = seleccionarServicio;
        })
    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e){
    let elemento;
    //Forzar que el elemento al cual le damos click sea el DIV
    if(e.target.tagName === 'P'){
        elemento = e.target.parentElement;
    } else{
        elemento = e.target;
    }

    if(elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');
    } else {
        elemento.classList.add('seleccionado');
    }
}