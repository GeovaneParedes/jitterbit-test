const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const pool = require('./database');
const { mapInputToDb } = require('./mapper');

const app = express();
app.use(express.json());

// Documentação Swagger (Rota: /api-docs)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- ROTA 1: CRIAR PEDIDO (Transaction ACID) ---
app.post('/order', async (req, res) => {
    const client = await pool.connect();
    try {
        const data = mapInputToDb(req.body); // Transformação (Requisito PDF)

        await client.query('BEGIN'); // Início da Transação

        // Salva Pedido
        await client.query(
            'INSERT INTO orders (orderId, value, creationDate) VALUES ($1, $2, $3)',
            [data.orderId, data.value, data.creationDate]
        );

        // Salva Itens (Requisito banco relacional)
        for (const item of data.items) {
            await client.query(
                'INSERT INTO items (orderId, productId, quantity, price) VALUES ($1, $2, $3, $4)',
                [data.orderId, item.productId, item.quantity, item.price]
            );
        }

        await client.query('COMMIT'); // Confirmação
        res.status(201).json({ message: "Pedido criado com sucesso", orderId: data.orderId });

    } catch (error) {
        await client.query('ROLLBACK'); // Desfaz tudo se der erro
        console.error(error);
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
});

// --- ROTA 2: LER PEDIDO ---
app.get('/order/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const orderRes = await pool.query('SELECT * FROM orders WHERE orderId = $1', [id]);
        
        if (orderRes.rows.length === 0) return res.status(404).json({ message: "Pedido não encontrado" });

        const itemsRes = await pool.query('SELECT * FROM items WHERE orderId = $1', [id]);
        res.json({ ...orderRes.rows[0], items: itemsRes.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ROTA 3: LISTAR TODOS ---
app.get('/order/list', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM orders ORDER BY creationDate DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ROTA 4: DELETAR ---
app.delete('/order/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM orders WHERE orderId = $1 RETURNING orderId', [req.params.id]);
        if (result.rowCount === 0) return res.status(404).json({ message: "Pedido não encontrado" });
        res.json({ message: "Pedido deletado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Se alguém acessar http://localhost:3000, vai direto para a documentação
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

// Iniciar Servidor (apenas se não for teste)
if (require.main === module) {
    const PORT = 3000;
    app.listen(PORT, () => console.log(`🚀 API rodando em http://localhost:${PORT}`));
}

module.exports = app;
