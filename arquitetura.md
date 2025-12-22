```mermaid
graph TD
    %% Módulo Raiz
    Root["AppModule<br/>(A Placa Mãe)"]

    %% Módulos de Infra (Transversais)
    subgraph "Infraestrutura (Core)"
        Config["ConfigModule<br/>(Lê .env)"]
        DB_Mod["DatabaseModule<br/>(TypeORM + MySQL)"]
    end

    %% Módulos de Negócio (Features)
    subgraph "Domínios de Negócio"
        Auth["AuthModule<br/>(Segurança/Login)"]
        UserM["UsersModule<br/>(Perfis)"]
        ServiceM["ServicesModule<br/>(Apoio Social)"]
        BizM["BusinessModule<br/>(Comércios Locais)"]
    end

    %% Relacionamentos
    Root --> Config
    Root --> DB_Mod
    Root --> Auth
    Root --> UserM
    Root --> ServiceM
    Root --> BizM

    %% Dependências entre módulos
    Auth -.->|Usa| UserM
    ServiceM -.->|Pertence a| UserM
    BizM -.->|Pertence a| UserM

    style Root fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style UserM fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
    style Auth fill:#ffccbc,stroke:#d84315,stroke-width:2px