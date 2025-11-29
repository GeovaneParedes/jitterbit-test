const pool = require('./database');

const createTables = async () => {
    const client = await pool.connect();
    try {
        console.log('🏗️ Criando tabelas no banco de dados...');

        // 1. Tabela Orders (Conforme PDF)
        await client.query(`
            CREATE TABLE IF NOT EXISTS orders (
                orderId VARCHAR(50) PRIMARY KEY,
                value DECIMAL(10, 2) NOT NULL,
                creationDate TIMESTAMP NOT NULL
            );
        `);

        // 2. Tabela Items (Conforme PDF - Relacionamento 1:N)
        await client.query(`
            CREATE TABLE IF NOT EXISTS items (
                id SERIAL PRIMARY KEY,
                orderId VARCHAR(50) REFERENCES orders(orderId) ON DELETE CASCADE,
                productId INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                price DECIMAL(10, 2) NOT NULL
            );
        `);

        console.log('✅ Tabelas Criadas com Sucesso!');
    } catch (err) {
        console.error('❌ Erro ao criar tabelas:', err);
    } finally {
        client.release();
        pool.end(); // Fecha a conexão para o script terminar
    }
};

createTables();
