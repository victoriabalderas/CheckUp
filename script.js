const form = document.getElementById("formAsistencia");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    mensaje.textContent = "✅ Asistencia registrada correctamente";
    form.reset();
});

