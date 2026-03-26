from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# 🔗 CONEXIÓN A MYSQL
try:
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",  # 🔥 cambia esto
        database="checkup",
        port=3306
    )
    print("✅ Conectado a MySQL")
except Exception as e:
    print("❌ Error de conexión:", e)

cursor = db.cursor(dictionary=True)

# 🧪 RUTA DE PRUEBA
@app.route('/')
def inicio():
    return "Servidor funcionando 🔥"

# 🔐 LOGIN
@app.route('/login', methods=['POST'])
def login():
    data = request.json

    sql = "SELECT * FROM empleados WHERE numero=%s AND password=%s"
    cursor.execute(sql, (data['usuario'], data['password']))

    user = cursor.fetchone()

    if user:
        return {"status": "ok", "usuario": user}
    else:
        return {"status": "error"}

# 🟢 REGISTRAR ASISTENCIA
@app.route('/registrar', methods=['POST'])
def registrar():
    data = request.json

    empleado = data['empleado']
    tipo = data['tipo']

    sql = """
        INSERT INTO asistencia (numero_empleado, tipo, fecha, hora)
        VALUES (%s, %s, CURDATE(), CURTIME())
    """

    cursor.execute(sql, (empleado, tipo))
    db.commit()

    return jsonify({"status": "ok"})

# 🚀 INICIAR SERVIDOR
if __name__ == '__main__':
    app.run(debug=True)

@app.route('/asistencia/<empleado>', methods=['GET'])
def obtener_asistencia(empleado):

    sql = """
        SELECT fecha, tipo, hora
        FROM asistencia
        WHERE numero_empleado = %s
        ORDER BY fecha DESC, hora DESC
    """

    cursor.execute(sql, (empleado,))
    datos = cursor.fetchall()

    return jsonify(datos)