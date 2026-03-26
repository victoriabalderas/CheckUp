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

// 🔓 CERRAR SESIÓN
function cerrarSesion() {
    localStorage.removeItem("empleado");
    location.reload();
}


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

function mostrarAsistencia(asistencias) {
    // Obtén el tbody de la tabla
    const tbody = document.querySelector("#tablaAsistencia tbody");
    tbody.innerHTML = ""; // limpiar tabla antes de llenar

    if (!asistencias || asistencias.length === 0) {
        tbody.innerHTML = "<tr><td colspan='3'>Sin registros</td></tr>";
        return;
    }

    // Recorrer cada registro y crear fila
    asistencias.forEach(r => {
        const fila = document.createElement("tr");

        const tdFecha = document.createElement("td");
        const tdTipo = document.createElement("td");
        const tdHora = document.createElement("td");

        tdFecha.textContent = r.fecha;
        tdTipo.textContent = r.tipo;
        tdHora.textContent = r.hora;

        fila.appendChild(tdFecha);
        fila.appendChild(tdTipo);
        fila.appendChild(tdHora);

        tbody.appendChild(fila);
    });
}

function cargarAsistencia() {
    let empleado = localStorage.getItem("empleado");

    fetch("http://127.0.0.1:5000/asistencia/" + empleado)
        .then(res => {
            if (!res.ok) throw new Error("Error en la petición: " + res.status);
            return res.json();
        })
        .then(data => {
            console.log("Asistencias:", data);
            mostrarAsistencia(data); // Llenamos la tabla
        })
        .catch(err => console.error("Error al cargar asistencia:", err));
}