const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mysql = require('mysql2'); // Importar el paquete mysql2
require('dotenv').config();  // Asegúrate de que dotenv esté instalado y configurado

const app = express();

// Usar el puerto proporcionado por Railway o 3000 en local
const PORT = process.env.PORT || 3000;

// Habilitar CORS para múltiples orígenes
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

// Conectar a MySQL usando la URL de conexión de Railway
const db = mysql.createConnection(process.env.MYSQL_URL);

// Conectar a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('Conectado a MySQL en Railway');
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

// Iniciar servidor en el puerto correcto
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});