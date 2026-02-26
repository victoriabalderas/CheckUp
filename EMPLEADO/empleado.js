// ===== VARIABLES DE SESIÓN =====
let sesionActiva = false;
let usuarioActual = null;


// ===== BASE DE DATOS SIMULADA =====
const empleados = {
    "1001": {
        password: "1234",
        nombre: "Ana Sofía Balderas",
        puesto: "Auxiliar Administrativo",
        area: "Recursos Humanos"
    },
    "1002": {
        password: "abcd",
        nombre: "Carlos Pérez",
        puesto: "Supervisor",
        area: "Producción"
    }
};


// ===== RELOJ =====
function actualizarReloj(){
    const reloj = document.getElementById("reloj");
    const fecha = document.getElementById("fecha");

    if(!reloj) return;

    const ahora = new Date();
    reloj.textContent = ahora.toLocaleTimeString();
    fecha.textContent = ahora.toLocaleDateString();
}

setInterval(actualizarReloj,1000);


// ===== LOGIN =====
function iniciarSesion(){

    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();

    if(!empleados[usuario] || empleados[usuario].password !== password){
        alert("Usuario o contraseña incorrectos");
        return;
    }

    sesionActiva = true;
    usuarioActual = usuario;

    document.getElementById("loginEmpleado").style.display = "none";
    document.getElementById("panelEmpleado").style.display = "block";

    document.getElementById("nombreEmpleado").textContent = empleados[usuario].nombre;
    document.getElementById("puestoEmpleado").textContent = empleados[usuario].puesto;
    document.getElementById("areaEmpleado").textContent = empleados[usuario].area;

    actualizarReloj();
}

function cerrarSesion(){
    sesionActiva = false;
    usuarioActual = null;

    document.getElementById("panelEmpleado").style.display = "none";
    document.getElementById("loginEmpleado").style.display = "block";

    document.getElementById("usuario").value = "";
    document.getElementById("password").value = "";
}
