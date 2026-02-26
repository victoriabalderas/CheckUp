function actualizarReloj(){
    const reloj = document.getElementById("reloj");
    const fecha = document.getElementById("fecha");

    if(!reloj || !fecha) return;

    const ahora = new Date();

    reloj.textContent = ahora.toLocaleTimeString();
    fecha.textContent = ahora.toLocaleDateString();
}

setInterval(actualizarReloj,1000);
actualizarReloj();

function mostrarEmpleado(){
    document.getElementById("portalEmpleado").classList.remove("oculto");
    document.getElementById("portalAdmin").classList.add("oculto");
}

function mostrarAdmin(){
    document.getElementById("portalEmpleado").classList.add("oculto");
    document.getElementById("portalAdmin").classList.remove("oculto");
}

function registrarAsistencia(){
    alert("Asistencia registrada correctamente.");
}