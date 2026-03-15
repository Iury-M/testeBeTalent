# Gerenciador de Pagamentos Multi-Gateway - BeTalent Tech

Este projeto é uma API RESTful desenvolvida para o teste prático da **BeTalent Tech**. O sistema gerencia transações financeiras com lógica de multi-gateway e suporte a **failover** (tentativa automática no próximo gateway em caso de erro).

## 📊 Nível de Implementação
* **Nível 1**: Valor da compra enviado via API e gateways sem autenticação (simulado via mocks).
* **Estrutura Completa**: Banco de dados estruturado com as tabelas `users`, `clients`, `products`, `gateways`, `transactions` e `transaction_products`.

## 🛠️ Tecnologias Utilizadas
* **Framework:** AdonisJS 6
* **Banco de Dados:** MySQL 8.0
* **ORM:** Lucid ORM
* **Validação:** VineJS
* **Testes:** Japa (TDD)
* **Ambiente:** Docker & Docker Compose

## 🚀 Instalação e Execução

### Pré-requisitos
* Node.js (v20+)
* Docker e Docker Compose

### Passo a Passo
1. **Subir os containers (Banco e Mocks):**
   ```
   docker compose up -d 

2. **Instalar dependências:**
   ```
   npm install 
   
3. **Configurar o Ambiente:**
Copie o **.env.example** para **.env** e configure as credenciais do MySQL.

4. **Rodar Migrations e Seeds:**

```bash
  node ace migration:run
  node ace db:seed
```


5. **Iniciar Servidor:**

```
  npm run dev 
```

**🧪 Testes Automatizados**
O projeto utiliza testes funcionais para validar o fluxo de compra e as regras de negócio.

```
  node ace test
```


**🛣️ Rotas da API**
**Pagamentos**
  POST /compras: Realiza uma tentativa de cobrança.

  GET /compras: Lista todas as transações realizadas.

  GET /compras/:id: Exibe detalhes de uma transação específica.

**Autenticação e Usuários**
  POST /signup: Cadastro de novos usuários.
  
  POST /login: Autenticação de usuários.
