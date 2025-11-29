# 🍕 Jitterbit Technical Challenge - Order Management API

API RESTful desenvolvida em Node.js para gerenciamento do ciclo de vida de pedidos (Criação, Leitura, Listagem e Exclusão). O projeto foca em robustez, integridade de dados (ACID) e arquitetura limpa.

## 📋 Sobre o Projeto

Esta aplicação simula um middleware de integração que recebe pedidos em um formato JSON (PT-BR), realiza a **Transformação de Dados (Data Mapping)** e persiste em um banco relacional (**PostgreSQL**) com esquema normalizado.

### 🚀 Diferenciais Técnicos Implementados
- **Arquitetura em Camadas:** Separação clara entre Rotas, Regra de Negócio (Mapper) e Banco de Dados.
- **Transações ACID:** Uso de `BEGIN`, `COMMIT` e `ROLLBACK` para garantir que Pedidos e Itens sejam salvos atomicamente.
- **Dockerized Environment:** Banco de dados isolado e reprodutível via Docker Compose.
- **Documentação Viva:** Swagger UI integrado e acessível na raiz.
- **Tratamento de Erros:** Respostas HTTP semânticas (201, 404, 500) e mensagens claras.

## 🛠️ Tecnologias

- **Runtime:** Node.js (v20 LTS)
- **Framework:** Express.js
- **Database:** PostgreSQL 15 (Docker)
- **Docs:** Swagger UI
- **Testing:** Jest

## ⚙️ Como Rodar Localmente

### Pré-requisitos
- Node.js e npm
- Docker e Docker Compose

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/GeovaneParedes/jitterbit-test.git
   cd jitterbit-test
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Suba o Banco de Dados (Docker):**
   ```bash
   docker compose up -d
   ```

4. **Crie as tabelas (Migração):**
   ```bash
   node src/setup-db.js
   ```
   *(Aguarde a mensagem: "✅ Tabelas Criadas com Sucesso!")*

5. **Inicie a API:**
   ```bash
   npm run dev
   ```

6. **Acesse a Documentação:**
   Abra seu navegador em: **[http://localhost:3000](http://localhost:3000)**

## 🛣️ Endpoints (Resumo)

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/order` | Cria um novo pedido (Payload em PT-BR -> Banco EN). |
| `GET` | `/order/:id` | Busca um pedido e seus itens por ID. |
| `GET` | `/order/list` | Lista todos os pedidos recentes. |
| `DELETE`| `/order/:id` | Remove um pedido e seus itens (Cascade). |

## 🧪 Testes

Para validar a lógica de transformação de dados (Mapper):
```bash
npm test
```

---
Desenvolvido por **Geovane Paredes**
