```mermaid
graph TD
    subgraph "Cliente (Quem acessa)"
        User["Usuarios Diversos<br/>(Moradores, Voluntários, Admins)"]
        Device["💻 Navegador / Postman<br/>(Simulando Front-end)"]
    end

    subgraph "Seu Ambiente Local (Host)"
        direction TB
        API["⚙️ Node.js + NestJS Server<br/>Porta: 3000"]
        DB[("🗄️ MySQL Database<br/>Porta: 3306")]
    end

    %% Fluxo
    User --> Device
    Device -- "1. Requisição HTTP (JSON)" --> API
    API -- "2. Query SQL (TypeORM)" --> DB
    DB -- "3. Retorno dos Dados" --> API
    API -- "4. Resposta HTTP (JSON)" --> Device

    %% Estilização simples
    style API fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style DB fill:#fff9c4,stroke:#fbc02d,stroke-width:2px