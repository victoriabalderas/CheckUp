// 1. INICIAR SESIÓN ADMIN
function iniciarSesionAdmin() {
    let usuario = document.getElementById("usuarioAdmin").value; 
    let password = document.getElementById("passwordAdmin").value;

    if (!usuario || !password) {
        alert("Completa todos los campos");
        return;
    }

    fetch("http://127.0.0.1:5000/login_admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: usuario, password: password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "ok") {
            localStorage.setItem("admin", JSON.stringify(data.admin));
            window.location.href = "admin.html"; 
        } else {
            alert("Datos incorrectos ❌");
        }
    })
    .catch(err => console.error("Error:", err));
}

// 2. CERRAR SESIÓN
function cerrarSesionAdmin() {
    localStorage.removeItem("admin");
    window.location.href = "admin.html"; // Redirigir al login
}

// 3. MANTENER SESIÓN Y CARGAR PANEL
window.onload = function () {
    let admin = localStorage.getItem("admin");

    if (admin) {
        // Si el login y el panel están en la misma página:
        const loginDiv = document.getElementById("loginAdmin");
        const panelDiv = document.getElementById("panelAdmin");

        if(loginDiv) loginDiv.style.display = "none";
        if(panelDiv) panelDiv.style.display = "block";

        cargarDatosAdmin();
    }
};

// 4. CARGAR DATOS GENERALES (Total Empleados)
function cargarDatosAdmin() {
    fetch("http://127.0.0.1:5000/total-empleados")
        .then(res => res.json())
        .then(data => {
            const totalElement = document.getElementById("totalEmpleados");
            if(totalElement) totalElement.textContent = data.total;
        })
        .catch(err => console.error("Error al cargar total:", err));

    // Llamamos también a cargar la tabla
    cargarTodasLasAsistencias();
}

// 5. CARGAR Y MOSTRAR TABLA DE ASISTENCIAS
function cargarTodasLasAsistencias() {
    fetch("http://127.0.0.1:5000/asistencias-todas")
        .then(res => {
            if (!res.ok) throw new Error("Error al obtener asistencias");
            return res.json();
        })
        .then(data => {
            // Usamos el ID de tu tabla en el HTML
            const tbody = document.querySelector("#tablaAsistenciaAdmin tbody");
            if (!tbody) return;

            tbody.innerHTML = "";

            if (data.length === 0) {
                tbody.innerHTML = "<tr><td colspan='5'>Sin registros</td></tr>";
                return;
            }

            data.forEach(r => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${r.id || '-'}</td>
                    <td>${r.numero_empleado}</td>
                    <td><span class="badge ${r.tipo}">${r.tipo.toUpperCase()}</span></td>
                    <td>${r.fecha}</td>
                    <td>${r.hora}</td>
                `;
                tbody.appendChild(fila);
            });

            renderizarGrafica(data);
            renderizarGraficaPorArea(data)
        })
        .catch(err => console.error("Error cargando tabla:", err));
}

function renderizarGrafica(data) {
    const ctx = document.getElementById('graficaAsistencia').getContext('2d');
    
    // Contamos cuántos hay de cada tipo en los datos de hoy
    const conteo = {
        entrada: data.filter(r => r.tipo === 'entrada').length,
        comida: data.filter(r => r.tipo === 'comida').length,
        fincomida: data.filter(r => r.tipo === 'fincomida').length,
        salida: data.filter(r => r.tipo === 'salida').length
    };

    // Si ya existe una gráfica, la destruimos para crear la nueva (evita errores visuales)
    if (window.miGrafica) {
        window.miGrafica.destroy();
    }

    window.miGrafica = new Chart(ctx, {
        type: 'doughnut', // Tipo "Dona", muy moderno
        data: {
            labels: ['Entradas', 'En Comida', 'Regreso Comida', 'Salidas'],
            datasets: [{
                data: [conteo.entrada, conteo.comida, conteo.fincomida, conteo.salida],
                backgroundColor: ['#27ae60', '#2980b9', '#f39c12', '#c0392b'],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: 'white', font: { size: 14 } }
                }
            },
            cutout: '70%' // Hace el centro más grande
        }
    });
}

function renderizarGraficaPorArea(data) {
    const canvas = document.getElementById('graficaDepartamentos');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');

    // 1. Contar cuántas asistencias hay por cada área
    const conteoAreas = {};
    data.forEach(r => {
        const nombreArea = r.area;
        conteoAreas[nombreArea] = (conteoAreas[nombreArea] || 0) + 1;
    });

    const etiquetas = Object.keys(conteoAreas);
    const valores = Object.values(conteoAreas);

    // 2. Limpiar gráfica anterior si existe
    if (window.chartAreas) {
        window.chartAreas.destroy();
    }

    // 3. Crear Gráfica de Barras
    window.chartAreas = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Registros Totales',
                data: valores,
                backgroundColor: [
                    '#3498db', '#9b59b6', '#f1c40f', '#e67e22', '#1abc9c'
                ],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { 
                    beginAtZero: true, 
                    ticks: { color: 'white', stepSize: 1 },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: { 
                    ticks: { color: 'white' },
                    grid: { display: false }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}