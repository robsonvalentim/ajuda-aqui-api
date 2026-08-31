# 4. Análise de Requisitos

## 4.1. Requisitos Funcionais (RF)

| ID | Requisito | Descrição |
| :--- | :--- | :--- |
| RF1 | Cadastro de Usuários | Cadastro de perfis diferentes (morador, voluntário, comerciante, administrador). |
| RF2 | Login e Autenticação | Autenticação com email e senha, segurança por JWT. |
| RF3 | Cadastro de Serviços | Cadastro de serviços sociais com título, descrição, local, categoria, horário. |
| RF4 | Cadastro de Doações | Cadastro de itens ou recursos disponíveis para doação. |
| RF5 | Busca por Serviços | Busca por bairro, categoria ou palavra-chave. |
| RF6 | Cadastro de Eventos | Cadastro de eventos comunitários. |
| RF7 | Cadastro de Comércios | Cadastro de negócios locais e seus produtos. |
| RF8 | Divulgação de Oportunidades | Cadastro e divulgação de oportunidades para a comunidade, incluindo vagas de emprego formal, trabalho informal (bicos), freelas, cursos e oficinas. |
| RF9 | Avaliação de Serviços | Sistema de avaliação e comentários para serviços utilizados. |
| RF10 | Painel Administrativo | Visualização de métricas, relatórios e gerenciamento. |

## 4.2. Requisitos Não-Funcionais (RNF)

| ID | Tipo | Descrição |
| :--- | :--- | :--- |
| RNF1 | Linguagem | O back-end será desenvolvido em JavaScript usando Node.js e Express.js. |
| RNF2 | Banco de Dados | O sistema utilizará MongoDB pela sua flexibilidade. |
| RNF3 | Desempenho | A API deve retornar respostas em até 500ms na maioria das requisições. |
| RNF4 | Escalabilidade | A arquitetura será preparada para escalar horizontalmente. |
| RNF5 | Segurança | O sistema utilizará criptografia para senhas (bcrypt), tokens JWT, etc. |
| RNF6 | Acessibilidade | O sistema deverá permitir acesso por leitores de tela e uso com teclado. |
| RNF7 | Usabilidade | O sistema será simples, com rotas RESTful claras. |
| RNF8 | Documentação | A API terá documentação via Swagger/OpenAPI. |
| RNF9 | Manutenção | A estrutura modular facilitará adições futuras. |
| RNF10 | Legalidade | O sistema estará em conformidade com a LGPD. |

## 4.3. Histórias de Usuário (User Stories)

| História | Critérios de Aceite |
| :--- | :--- |
| "Como morador, quero encontrar serviços sociais no meu bairro..." | O sistema exibe serviços por geolocalização ou nome do bairro. Filtros por categoria estarão disponíveis. |
| "Como comerciante local, quero cadastrar meu negócio..." | O comerciante cadastra nome do negócio, localização, tipo de produto e horários de atendimento. |
| "Como voluntário, quero divulgar um curso gratuito..." | A rota de eventos permite cadastrar título, descrição, data, local e contato. |
| "Como usuário, quero avaliar um serviço que utilizei..." | O sistema valida que o usuário tenha usado o serviço antes de permitir a avaliação. |
| "Como administrador, quero visualizar relatórios..." | Um dashboard exibirá métricas com filtros por data, bairro, tipo de serviço. |