const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Obter todos os veículos
app.get('/api/vehicles', (req, res) => {
    fs.readFile(DB_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Erro ao ler banco de dados' });
        res.json(JSON.parse(data || '[]'));
    });
});

// Salvar/Atualizar a lista de veículos
app.post('/api/vehicles', (req, res) => {
    const vehicles = req.body;
    fs.writeFile(DB_FILE, JSON.stringify(vehicles, null, 2), (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao salvar dados' });
        res.json({ message: 'Dados salvos com sucesso!' });
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});