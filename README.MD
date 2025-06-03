# 🚜 API Brain Agriculture

![Node.js](https://img.shields.io/badge/node-22.x-brightgreen)  

## 🌱 Visão Geral

A **API Brain Agriculture** é uma aplicação backend desenvolvida para gerenciar dados do setor agrícola, incluindo produtores, fazendas, culturas e colheitas. Construída com **NestJS**, **PostgreSQL** e **TypeORM**, a API oferece uma estrutura escalável, segura e de fácil manutenção, com foco em rastreabilidade e análise de dados do campo.

---

## 🏗️ Arquitetura

- **Framework:** NestJS (com TypeScript e injeção de dependência)
- **Banco de Dados:** PostgreSQL com TypeORM
- **ORM:** TypeORM com suporte a UUIDs e migrações
- **Infraestrutura:** Docker + Railway
- **Documentação:** Swagger em `/api`

---

## 🧩 Diagrama de Entidades (ERD)

```mermaid
erDiagram
  PRODUCER ||--o{ FARM : has
  FARM ||--o{ FARM_CROP_HARVEST : contains
  HARVEST ||--o{ FARM_CROP_HARVEST : includes
  CROP ||--o{ FARM_CROP_HARVEST : produces

  PRODUCER {
    int id PK
    string producer_name
    string cpf_cnpj
  }

  FARM {
    UUID id PK
    string farm_name
    string city
    string state
    float total_area
    float arable_area
    float vegetation_area
    UUID producerId FK
  }

  HARVEST {
    UUID id PK
    string harvest_name
  }

  CROP {
    UUID id PK
    string crop_name
  }

  FARM_CROP_HARVEST {
    UUID id PK
    UUID farmId FK
    UUID cropId FK
    UUID harvestId FK
  }
```

## ⚙️ Principais Funcionalidades

- API RESTful para gerenciamento de produtores, fazendas, safras e culturas
- Swagger com OpenAPI disponível em `/api`
- Migrações com TypeORM para controle de schema
- Suporte a SSL em ambientes de produção
- Modularização por recursos (`Producer`, `Farm`, `Dashboard` etc.)

---

## 🚀 Implantação

### 🔗 Link de produção (Railway)

> [https://brainagriculture-production.up.railway.app/api/](https://brainagriculture-production.up.railway.app/api/)

### 🧰 Pré-requisitos

- Node.js v22
- Docker e Docker Compose

---

## 🛠️ Instalação

### Clonar o repositório

```bash
git clone https://github.com/seu-usuario/brain-agriculture.git
cd brain-agriculture
```

### Instalar dependências

```bash
npm install
```

### Arquivo `.env`

Copie o arquivo `.env.example` e configure:

```env
DATABASE_URL=postgresql://usuario:senha@host:porta/banco
```

---

## 🐳 Docker

Para subir o ambiente com Docker:

```bash
docker-compose -f docker-compose.dev.yml up
```

---

## 🧪 Testes

Executar todos os testes automatizados (Jest):

```bash
npm run test
```

---

## ▶️ Execução Local

```bash
npm run start:dev
```

Acesse a documentação Swagger em:

```
http://localhost:3000/api
```

---

## 💡 Exemplo de Endpoint

```http
GET /producers
```

**Resposta:**
```json
[
  {
    "id": 1,
    "producer_name": "João da Silva",
    "cpf_cnpj": "12345678900"
  }
]
```

---

## 📄 Licença

Dilenio Enderle.
