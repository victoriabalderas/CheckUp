// 🔐 LOGIN

console.log("JS cargado 🔥");

function iniciarSesion() {

    let usuario = document.getElementById("usuario").value;
    let password = document.getElementById("password").value;

    if (!usuario || !password) {
        alert("Completa todos los campos");
        return;
    }

    fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuario: usuario,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {

        if (data.status === "ok") {

            let u = data.usuario;

            // 💾 guardar sesión
            localStorage.setItem("empleado", u.numero);

            // 🔥 usar función nueva
            mostrarPanelEmpleado(u);

        } else {
            alert("Datos incorrectos ❌");
        }

    })
    .catch(err => console.error("Error:", err));
}


// 📊 CARGAR ASISTENCIA DESDE MYSQL
function cargarAsistencia() {

    let empleado = localStorage.getItem("empleado");

    fetch("http://127.0.0.1:5000/asistencia/" + empleado)
    .then(res => res.json())
    .then(data => {

        console.log("DATOS:", data); // 🔥 DEBUG

        let tabla = document.querySelector("#tablaAsistencia tbody");
        tabla.innerHTML = "";

        if (!data || data.length === 0) {
            tabla.innerHTML = "<tr><td colspan='3'>Sin registros</td></tr>";
            return;
        }

        data.forEach(r => {

            let fila = document.createElement("tr");

            let fecha = document.createElement("td");
            let tipo = document.createElement("td");
            let hora = document.createElement("td");

            fecha.textContent = r.fecha;
            tipo.textContent = r.tipo;
            hora.textContent = r.hora;

            fila.appendChild(fecha);
            fila.appendChild(tipo);
            fila.appendChild(hora);

            tabla.appendChild(fila);
        });

    })
    .catch(err => console.error("Error:", err));
}


// 🔓 CERRAR SESIÓN
function cerrarSesion() {
    localStorage.removeItem("empleado");
    location.reload();
}


// 🔄 MANTENER SESIÓN (AUTO LOGIN)
window.onload = function () {

    let empleado = localStorage.getItem("empleado");

    if (empleado) {
        // Si ya hay sesión, ir directo al panel
        document.getElementById("loginEmpleado").style.display = "none";
        document.getElementById("panelEmpleado").style.display = "block";

        cargarAsistencia();
    }
};

function mostrarPanelEmpleado(u) {

    // 🔥 llenar datos en tabla
    document.getElementById("numEmpleado").textContent = u.numero;
    document.getElementById("nombreEmpleado").textContent = u.nombre;
    document.getElementById("puestoEmpleado").textContent = u.puesto;
    document.getElementById("areaEmpleado").textContent = u.area;

    // 🔄 ocultar login y mostrar panel
    document.getElementById("loginEmpleado").style.display = "none";
    document.getElementById("panelEmpleado").style.display = "block";

    // 📊 cargar asistencia
    cargarAsistencia();
}