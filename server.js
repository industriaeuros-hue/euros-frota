const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Cole aqui a sua chave Publishable do Supabase (aquela que começa com sb_publishable_...)
const SUPABASE_URL = 'https://aehnwhbmzqxjffwiton.supabase.co';
const SUPABASE_KEY = 'sb_publishable_2i-n4i9tZNNGxDvODCRVSg_0k_Y4i7Y';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Obter os veículos do Supabase
app.get('/api/vehicles', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('app_state')
            .select('*')
            .eq('id', 'main_data')
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 ignora se a linha ainda não existir
            throw error;
        }

        // Retorna os dados salvos ou um array vazio se for a primeira vez
        res.json(data ? data.payload : []);
    } catch (err) {
        console.error('Erro ao buscar dados do Supabase:', err);
        res.status(500).json({ error: 'Erro ao ler banco de dados' });
    }
});

// Salvar/Atualizar os veículos no Supabase
app.post('/api/vehicles', async (req, res) => {
    try {
        const vehiclesData = req.body;

        const { error } = await supabase
            .from('app_state')
            .upsert({ 
                id: 'main_data', 
                payload: vehiclesData 
            });

        if (error) throw error;
        res.json({ message: 'Dados salvos com sucesso!' });
    } catch (err) {
        console.error('Erro ao salvar no Supabase:', err);
        res.status(500).json({ error: 'Erro ao salvar dados' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});