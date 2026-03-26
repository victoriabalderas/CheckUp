from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/*": {"origins": "*"}})

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

# 📊 OBTENER ASISTENCIA (para llenar la tabla)
@app.route('/asistencia/<empleado_id>', methods=['GET'])
def obtener_asistencia(empleado_id):
    try:
        cursor = db.cursor(dictionary=True)  # 🔹 nuevo cursor
        sql = "SELECT fecha, tipo, hora FROM asistencia WHERE numero_empleado=%s ORDER BY fecha, hora"
        cursor.execute(sql, (empleado_id,))
        registros = cursor.fetchall()
        cursor.close()
        for r in registros:
            r['fecha'] = r['fecha'].strftime("%Y-%m-%d")  # fecha a string
            r['hora'] = str(r['hora'])  # hora a string HH:MM:SS

        return jsonify(registros)
    except Exception as e:
        print("Error en /asistencia:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)