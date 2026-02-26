let adminActivo = false;

function iniciarSesionAdmin(){

    const user = document.getElementById("adminUser").value;
    const pass = document.getElementById("adminPass").value;

    if(user === "admin" && pass === "1234"){
        adminActivo = true;

        document.getElementById("loginAdmin").style.display = "none";
        document.getElementById("panelAdmin").style.display = "block";
    }else{
        alert("Credenciales incorrectas");
    }
}

function cerrarSesionAdmin(){
    adminActivo = false;

    document.getElementById("panelAdmin").style.display = "none";
    document.getElementById("loginAdmin").style.display = "block";

    document.getElementById("adminUser").value = "";
    document.getElementById("adminPass").value = "";
}