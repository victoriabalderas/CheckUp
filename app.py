from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from datetime import date, timedelta

app = Flask(__name__)
# Configuración simple de CORS para permitir todo durante el desarrollo
CORS(app)

# 🔗 CONEXIÓN A MYSQL
try:
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",  # 🔥 Asegúrate de que esta sea tu contraseña real
        database="checkup",
        port=3306
    )
    print("✅ Conectado a MySQL")
except Exception as e:
    print("❌ Error de conexión:", e)
    db = None

# 🔐 LOGIN EMPLEADO
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        cursor = db.cursor(dictionary=True)
        sql = "SELECT * FROM empleados WHERE numero=%s AND password=%s"
        cursor.execute(sql, (data['usuario'], data['password']))
        user = cursor.fetchone()
        cursor.close()
        
        if user:
            return jsonify({"status": "ok", "usuario": user})
        return jsonify({"status": "error", "message": "Usuario no encontrado"})
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500

# 🔐 LOGIN ADMIN (Corregido para coincidir con el JS)
@app.route('/login_admin', methods=['POST'])
def login_admin():
    try:
        data = request.json
        cursor = db.cursor(dictionary=True)
        sql = "SELECT * FROM administradores WHERE usuario=%s AND password=%s"
        cursor.execute(sql, (data['usuario'], data['password']))
        admin = cursor.fetchone()
        cursor.close()
        
        if admin:
            return jsonify({"status": "ok", "admin": admin})
        return jsonify({"status": "error", "message": "Admin no encontrado"})
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500

# 🟢 REGISTRAR ASISTENCIA
@app.route('/registrar', methods=['POST'])
def registrar():
    try:
        data = request.json
        empleado = data['empleado']
        tipo = data['tipo']
        cursor = db.cursor()
        sql = """
            INSERT INTO asistencia (numero_empleado, tipo, fecha, hora)
            VALUES (%s, %s, CURDATE(), CURTIME())
        """
        cursor.execute(sql, (empleado, tipo))
        db.commit()
        cursor.close()
        return jsonify({"status": "ok"})
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500

# 📊 OBTENER ASISTENCIA (INDIVIDUAL)
@app.route('/asistencia/<empleado_id>', methods=['GET'])
def obtener_asistencia(empleado_id):
    try:
        cursor = db.cursor(dictionary=True)
        sql = "SELECT fecha, tipo, hora FROM asistencia WHERE numero_empleado=%s ORDER BY fecha DESC, hora DESC"
        cursor.execute(sql, (empleado_id,))
        registros = cursor.fetchall()
        cursor.close()
        
        for r in registros:
            r['fecha'] = r['fecha'].strftime("%Y-%m-%d")
            r['hora'] = str(r['hora'])

        return jsonify(registros)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 📊 TODAS LAS ASISTENCIAS (ADMIN) - Corregido
@app.route('/asistencias-todas', methods=['GET'])
def asistencias_todas():
    try:
        cursor = db.cursor(dictionary=True)
        # Usamos e.area en el SELECT
        sql = """
            SELECT a.*, e.area 
            FROM asistencia a
            JOIN empleados e ON a.numero_empleado = e.numero
            ORDER BY a.fecha DESC, a.hora DESC
        """
        cursor.execute(sql)
        resultados = cursor.fetchall()
        cursor.close()

        asistencias = []
        for r in resultados:
            asistencias.append({
                "id": r.get("id"),
                "numero_empleado": r.get("numero_empleado"),
                "tipo": r.get("tipo"),
                "area": r.get("area") or "Sin Área", # Extraemos el área
                "fecha": r.get("fecha").strftime("%Y-%m-%d") if r.get("fecha") else "",
                "hora": str(r.get("hora")) if r.get("hora") else ""
            })

        return jsonify(asistencias)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)