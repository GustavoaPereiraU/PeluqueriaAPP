let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []

}

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp()
});

function iniciarApp(){
    mostrarServicios()

    //resalta el  DIV actual con eñ tab al que se preciona
    mostrarSeccion()

    //oculta o muestra una sección según el tab a que se preciona
    cambiarSeccion();

    //Paginacion siguient y anterior
    paginaSiguiente();
    paginaAnterior();

    //Paginador
    botonesPaginador();

    //Muestra el resumen de la cita o mensaje de error en caso de no pasar la validación
    mostrarResumen();
}
function mostrarSeccion() {
    //eliminar mostrar-seccion de la seccion anterior
    const seccionAnterior =  document.querySelector('.mostrar-seccion')
    if (seccionAnterior){
        seccionAnterior.classList.remove('mostrar-seccion');
    }
       
    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //Elimina la clase actual  en el tab anterior
    const tabAnterior = document.querySelector('.tabs button.actual')
    if (tabAnterior){
        tabAnterior.classList.remove('actual');
    }
    
   

    //Resaltar la seccion actual
    const tab = document.querySelector(`[data-paso='${pagina}']`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach( enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);
            // llamar la funcion de mostrar seccion
            mostrarSeccion()
            botonesPaginador();
        })
    });

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
        
        eliminarServicio();
    } else {
        elemento.classList.add('seleccionado');
        agregarServicio();
    }
    
}
function agregarServicio(){
    console.log('Agregando Servicio')
}

function eliminarServicio(){
    console.log('Eliminando Servicio')
}

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click',() => {
        pagina++;

        botonesPaginador();
    })
}

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;

        botonesPaginador();
    });
}

function botonesPaginador(){
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina === 1){
    paginaAnterior.classList.add('ocultar');
    } else if (pagina === 3){
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
    }else{
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion(); // Cambia la seccion que se muestra por la de la pagina
}

function mostrarResumen(){
    //Destructuring
    const { nombre, fecha, hora, servicio } = cita;
    
    //Seleccionar el reusmen
    const resumenDIV = document.querySelector('.contenido-resumen');

    //validación de objeto
    if(Object.values(cita).includes('')){
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Falta datos de Servicios, fecha, hora, o nombre';

        noServicios.classList.add('invalidar-cita');

        //Agregar a resumenDIV
        resumenDIV.appendChild(noServicios)
    }
}