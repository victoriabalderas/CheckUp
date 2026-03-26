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


function registrarAsistencia(tipo) {

    let empleado = document.getElementById("empleado").value;

    if (!empleado) {
        alert("Ingresa tu número de empleado");
        return;
    }

    fetch("http://127.0.0.1:5000/registrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            empleado: empleado,
            tipo: tipo
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "ok") {
            alert("Registro: " + tipo + " | Empleado: " + empleado);
        } else {
            alert("Error al registrar");
        }
    })
    .catch(err => console.error(err));
}