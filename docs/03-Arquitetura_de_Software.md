# 3. Arquitetura de Software

## 3.1. Arquitetura Adotada

O projeto adota uma arquitetura de **Monólito Modular**. A decisão foi tomada para maximizar a velocidade de desenvolvimento e reduzir a complexidade operacional, sem sacrificar a organização e a manutenibilidade do código.

### 3.1.1. Introdução à Decisão Arquitetural

A definição da arquitetura de software é uma das decisões mais impactantes no ciclo de vida de um projeto. Para o "Ajuda Aqui – Central de Apoio Comunitário", a escolha recaiu sobre a abordagem de Monólito Modular, em detrimento da popular arquitetura de Microsserviços. Esta não é uma decisão baseada em tendências, mas uma escolha pragmática e estratégica, alinhada aos objetivos do projeto, ao estágio atual de desenvolvimento e aos requisitos não-funcionais estabelecidos, como desempenho , manutenibilidade e velocidade de entrega.

### 3.1.2. Análise da Arquitetura de Microsserviços no Contexto do Projeto

A arquitetura de Microsserviços consiste em decompor uma aplicação em um conjunto de serviços menores, independentes e fracamente acoplados. Cada serviço é responsável por uma funcionalidade de negócio específica, possui sua própria base de código e, frequentemente, seu próprio banco de dados, comunicando-se com os demais através de APIs.
Embora poderosa para cenários de altíssima escala, com equipes de desenvolvimento grandes e distribuídas, sua adoção para o "Ajuda Aqui" nesta fase traria mais desafios do que benefícios:
* **Complexidade Operacional**: A gestão de múltiplos serviços implica uma sobrecarga significativa. Seria necessário implementar e gerenciar um ecossistema complexo de ferramentas para Service Discovery, API Gateway, monitoramento distribuído e tolerância a falhas na comunicação de rede entre os serviços. Essa complexidade desviaria o foco do desenvolvimento das funcionalidades centrais que geram valor para a comunidade.
* **Sobrecarga de Desenvolvimento**: Para um desenvolvedor individual, o esforço de criar, configurar, testar e implantar múltiplos serviços de forma independente é exponencialmente maior do que em uma base de código unificada. Isso impactaria negativamente a velocidade de desenvolvimento, um fator crítico para um projeto em estágio inicial.
* **Desafios de Consistência de Dados**: A abordagem de um banco de dados por serviço introduz complexidade na gestão de transações distribuídas e na manutenção da consistência dos dados. Operações simples em um monólito, como vincular um serviço a um usuário, poderiam se tornar complexas, exigindo padrões como Sagas ou orquestração, que são excessivos para as necessidades atuais do projeto.

### 3.1.3. A Escolha Estratégica pelo Monólito Modular

A arquitetura escolhida, Monólito Modular, consiste em desenvolver a aplicação como uma única unidade de implantação, mas com uma forte disciplina de organização interna. O código é estruturado em módulos lógicos bem definidos (ex: autenticação, serviços, eventos), cada um com responsabilidades claras e baixo acoplamento entre si.
Esta abordagem foi selecionada por oferecer os seguintes benefícios diretos ao projeto "Ajuda Aqui":
* **Simplicidade e Foco**: Ao reduzir a complexidade operacional a um mínimo, a arquitetura permite que o esforço de desenvolvimento seja 100% focado em implementar e refinar os requisitos funcionais, que são o coração do projeto.
* **Desenvolvimento Ágil**: A base de código unificada simplifica a depuração, os testes e o processo de implantação. A comunicação entre os módulos ocorre por meio de chamadas de função diretas, eliminando a latência de rede e a complexidade de chamadas remotas, o que contribui para atender ao requisito de desempenho (RNF3).
* **Manutenibilidade e Organização (RNF9)**: A estrutura modular garante que o projeto não se torne um "big ball of mud" (grande bola de lama). As fronteiras claras entre os módulos facilitam o entendimento do código, a adição de novas funcionalidades e a correção de bugs, cumprindo o requisito de manutenção.
* **Escalabilidade Eficaz (RNF4)**: A aplicação, embora monolítica, foi projetada desde o início para ser escalável horizontalmente. Ela pode ser replicada em múltiplos servidores ou contêineres para lidar com o aumento da carga, uma estratégia eficaz e comprovada para a grande maioria das aplicações web.

### 3.1.4. Conclusão: Uma Arquitetura Presente e Futura

A escolha pelo Monólito Modular é a decisão de engenharia mais sensata para o "Ajuda Aqui". Ela oferece o caminho mais rápido e simples para entregar um produto funcional, robusto e de alto impacto social.
Mais importante, essa arquitetura não limita o futuro. Um monólito bem estruturado e com baixo acoplamento entre seus módulos é o precursor ideal para uma futura migração para microsserviços. Caso o projeto atinja uma escala massiva que justifique essa complexidade, os módulos internos bem definidos poderão ser extraídos e convertidos em microsserviços de forma gradual e segura.


## 3.2. Diagrama da Arquitetura

[Diagrama a ser inserido]

## 3.3. Tecnologias Utilizadas (Tech Stack)

| Camada | Ferramentas |
| :--- | :--- |
| **Backend** | Node.js + Express.js |
| **Banco de Dados** | MongoDB (NoSQL) |
| **Testes** | Jest, Supertest |
| **Documentação API** | Swagger / OpenAPI |
| **Autenticação** | JWT (token) e bcrypt para senhas |