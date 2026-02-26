function actualizarReloj(){
    const reloj = document.getElementById("reloj");
    const fecha = document.getElementById("fecha");

    const ahora = new Date();

    const horas = String(ahora.getHours()).padStart(2,'0');
    const minutos = String(ahora.getMinutes()).padStart(2,'0');
    const segundos = String(ahora.getSeconds()).padStart(2,'0');

    reloj.textContent = `${horas}:${minutos}:${segundos}`;
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
    const empleadoInput = document.getElementById("empleado");
    const empleado = empleadoInput.value.trim();

    if(empleado === ""){
        alert("Por favor ingresa tu número de empleado.");
        empleadoInput.focus();
        return;
    }

    const hora = document.getElementById("reloj").textContent;

    alert("Asistencia registrada correctamente.\nEmpleado: " 
          + empleado + "\nHora: " + hora);

    // Limpia el campo después de registrar
    empleadoInput.value = "";
}