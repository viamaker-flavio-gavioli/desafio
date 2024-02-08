const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
app.use(express.json());

async function main() {
    const pg = new Client({
        host: '127.0.0.1',
        port: 5432,
        database: 'lista_de_produtos',
        user: 'postgres',
        password: 'admin'
    });

    await pg.connect();
    console.log('Conectado ao PostgreSQL');

    app.use(cors());

    app.get('/produtos', async (req, res) => {
        try {
            const result = await pg.query('SELECT * FROM produtos ORDER BY id');
            const produtos = result.rows;

            res.json(produtos);
        } catch (error) {
            console.error('Erro ao obter produtos do banco de dados:', error);
            res.status(500).json({ error: 'Erro ao obter produtos do banco de dados' });
        }
    });

    app.post('/produtos', async (req, res) => {
        const { nome, preco, imagem } = req.body;

        try {
            // Converte o preço para um número antes de inserir no banco de dados
            const precoNumerico = parseFloat(preco);

            const result = await pg.query('INSERT INTO produtos (nome, preco, imagem) VALUES ($1, $2, $3) RETURNING *', [nome, precoNumerico, imagem]);
            const novoProduto = result.rows[0];
            
            res.status(201).json(novoProduto);
        } catch (error) {
            console.error('Erro ao adicionar produto ao banco de dados:', error);
            res.status(500).json({ error: 'Erro ao adicionar produto ao banco de dados' });
        }
    });

    const PORT = 3210;
    app.listen(PORT, () => console.log(`Servidor aberto na porta ${PORT}`));
}

main();
