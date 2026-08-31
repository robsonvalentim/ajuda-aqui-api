# 5. Modelagem do Banco de Dados

## 5.1. SGBD Escolhido

O banco de dados escolhido foi o **MongoDB (NoSQL)**. A escolha se deu por sua flexibilidade (schemaless), que permite a fácil evolução da estrutura de dados, e sua sinergia com o ecossistema JavaScript/JSON, tornando o desenvolvimento mais fluido e intuitivo.

## 5.2. Esquemas das Coleções (Collections)

Abaixo estão as estruturas de dados iniciais planejadas.

### `users`
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String",
  "password": "String (hashed)",
  "profile": "String ('morador', 'admin', etc.)",
  "createdAt": "Date"
}
```

### `services`
```json
{
  "_id": "ObjectId",
  "title": "String",
  "description": "String",
  "category": "String",
  "location": {
    "address": "String",
    "coordinates": "[Number, Number]"
  },
  "openingHours": "String",
  "contact": "String",
  "author": "ObjectId (ref: users)",
  "createdAt": "Date"
}
```

### `businesses`
```json
{
  "_id": "ObjectId",
  "name": "String",
  "description": "String",
  "category": "String", // Ex: "Alimentação", "Serviços", "Vestuário"
  "location": {
    "address": "String"
  },
  "openingHours": "String",
  "contact": "String",
  "owner": "ObjectId (ref: users)"
}
```

### `events`
```json
{
  "_id": "ObjectId",
  "title": "String",
  "description": "String",
  "date": "Date",
  "location": {
    "address": "String"
  },
  "organizer": "ObjectId (ref: users)",
  "createdAt": "Date"
}
```

### `donations`
```json
{
  "_id": "ObjectId",
  "title": "String",
  "description": "String",
  "type": "String", // 'NECESSIDADE' ou 'DOACAO'
  "items": ["String"], // Lista de itens
  "status": "String", // 'ABERTO', 'FECHADO', 'EM_ANDAMENTO'
  "requester": "ObjectId (ref: users)",
  "createdAt": "Date"
}
```

### `opportunities`
```json
{
  "_id": "ObjectId",
  "title": "String",
  "description": "String",
  "type": "String", // 'VAGA', 'CURSO', 'OFICINA'
  "requirements": ["String"], // Pré-requisitos
  "contact": "String",
  "poster": "ObjectId (ref: users)",
  "createdAt": "Date"
}
```

### `reviews`
```json
{
  "_id": "ObjectId",
  "rating": "Number", // Ex: 1 a 5
  "comment": "String",
  "author": "ObjectId (ref: users)",
  "targetId": "ObjectId", // ID do serviço, negócio ou evento avaliado
  "targetModel": "String", // 'Service', 'Business', ou 'Event'
  "createdAt": "Date"
}
```