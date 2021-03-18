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

    //Almacena el nombre de la cita en el objeto
    nombreCita();

    //Almacena la fecha de la cita en el objeto
    fechaCita();

    //Deshabilita dias pasados
    deshabilitarFechaAnterior();
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
            servicioDiv.dataset.idServicio = id;


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
        
        const id = elemento.dataset.idServicio;
        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt( elemento.dataset.idServicio ),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent,
        }
        

        // console.log(servicioObj);

        agregarServicio(servicioObj);
    }
    
}
function agregarServicio(servicioObj){
    const { servicios } = cita;
    cita.servicios = [...servicios, servicioObj];

    console.log(cita);
    
}

function eliminarServicio(id){
    const { servicios } = cita;
    cita.servicios = servicios.filter( servicio => servicio.id != id );

    console.log(cita)
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

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input' , e => {
        const nombreTexto = e.target.value.trim();
        // console.log(nombreTexto)

        //Validacion de que enombreTexto debe tener algo
        if( nombreTexto === '' || nombreTexto.length < 3 ){
            mostrarAlerta('nombre no valido', 'error')
        } else {
            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    });
}

function mostrarAlerta(mensaje, tipo){

    //si hay una alerta previa no crear otra 

    const alertaPrevia = document.querySelector('.alerta'); 
    if (alertaPrevia){
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if (tipo === 'error') {
        alerta.classList.add('error')
    }
    //insertar en el html
    const formulario = document.querySelector('.formulario');
    formulario.appendChild( alerta );

    //eliminar la alerta despues de 3 segundos 
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaCita(){
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e =>{
        
        const dia = new Date(e.target.value).getUTCDay();

        if([0].includes(dia)){
            fechaInput.value = '';
            mostrarAlerta('No se agendan citas los domingos.', 'error');
        } else {
            cita.fecha = fechaInput.value;
            console.log(cita)
        }
    })
}

function deshabilitarFechaAnterior(){
    const inputFechas = document.querySelector('#fecha');
    
    const fechaAhora = new Date();
    const year = fechaAhora.getUTCFullYear();
    const month = fechaAhora.getUTCMonth() + 1;
    const day = fechaAhora.getDate();

    //formato deseado: AAA-MM-DD
    const fechaDeshabilitar =  `${year}-${month < 10 ? `0${month}` : month}-${day}`;
    

    inputFechas.min = fechaDeshabilitar;

}
