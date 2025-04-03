const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS
const allowedOrigins = ['http://localhost:3000', 'https://tudominio.com'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    }
}));

// Middleware para JSON
app.use(express.json());

// Configurar conexión a MySQL
const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT
});

// Intentar conectar a MySQL
db.connect(err => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err.message);
        process.exit(1);
    }
    console.log('✅ Conectado a MySQL en Railway');
});

// Endpoint de prueba
app.get('/api/status', (req, res) => {
    res.json({ message: 'API funcionando correctamente' });
});

// Endpoint para datos simulados
app.get('/api/data', (req, res) => {
    res.json({ users: [{ id: 1, name: 'Juan' }, { id: 2, name: 'María' }] });
});

// Endpoint proxy para consumir servicios externos
app.get('/api/proxy', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'Falta el parámetro URL' });

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error al consumir el servicio externo' });
    }
});

// 🆕 Endpoint para obtener usuarios desde MySQL
app.get('/api/users', (req, res) => {
    const query = 'SELECT * FROM usuarios';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Error en la consulta:', err.message);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }
        res.json(results);
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
});