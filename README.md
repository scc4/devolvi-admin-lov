
# Devolvi - Sistema de Gestão

![Logo Devolvi](https://lovable.dev/projects/15317c0d-207c-43c9-9d8e-8211438c5256)

## Visão Geral

O Devolvi é um sistema de gestão criado para gerenciar estabelecimentos, transportadoras e pontos de coleta. O sistema utiliza arquitetura limpa e padrões de design modernos para criar uma aplicação escalável e manutenível.

## Arquitetura da Aplicação

O projeto segue os princípios de Arquitetura Limpa (Clean Architecture) e Design Orientado a Domínio (DDD), estruturado em camadas:

### Camadas da Aplicação

1. **Camada de Apresentação (Presentation)**
   - Interfaces de usuário e componentes React
   - Hooks de integração com casos de uso
   - Gerenciamento de estado da UI

2. **Camada de Aplicação (Application)**
   - Casos de uso (Use Cases)
   - DTOs (Data Transfer Objects)
   - Orquestração de fluxos de negócio

3. **Camada de Domínio (Domain)**
   - Entidades de negócio (Entities)
   - Objetos de valor (Value Objects)
   - Interfaces de repositórios (Repository Interfaces)
   - Regras de negócio independentes de infraestrutura

4. **Camada de Infraestrutura (Infrastructure)**
   - Implementação dos repositórios
   - Integrações externas
   - Persistência de dados
   - Injeção de dependências

### Padrões Implementados

- **Domain-Driven Design (DDD)**: Foco nas regras de negócio através de entidades e objetos de valor
- **Injeção de Dependências (DI)**: Utilizando containers para gerenciar dependências
- **Repositório**: Abstração da camada de persistência
- **Caso de Uso**: Encapsulamento de lógica de negócio específica

## Tecnologias Utilizadas

- **Frontend**:
  - React + TypeScript
  - Vite (build tool)
  - Tailwind CSS (estilização)
  - shadcn/ui (componentes UI)
  - React Query (gerenciamento de estado e requisições)
  - React Router (roteamento)

- **Backend**:
  - Supabase (Banco de dados PostgreSQL)
  - Edge Functions (funções serverless)
  - Autenticação e autorização

## Principais Componentes

### Estabelecimentos (Establishments)

Os estabelecimentos representam locais físicos onde os pontos de coleta podem ser instalados.

- **Componentes Principais**:
  - `EstablishmentsWithDI`: Página principal de estabelecimentos usando DI
  - `EstablishmentsTable`: Tabela responsiva para listar estabelecimentos
  - `EstablishmentFormDialog`: Modal para criar/editar estabelecimentos

### Transportadoras (Carriers)

Transportadoras são empresas responsáveis por fazer a coleta nos pontos de coleta.

- **Componentes Principais**:
  - `CarriersTable`: Tabela responsiva para listar transportadoras
  - `EditCarrierDialog`: Modal para edição de transportadoras
  - `ServedCitiesTab`: Gerenciamento de cidades atendidas pela transportadora

### Pontos de Coleta (Collection Points)

Os pontos de coleta são locais específicos configurados para receber materiais.

- **Componentes Principais**:
  - `CollectionPointsTabWithDI`: Gerenciamento de pontos de coleta com DI
  - `CollectionPointAssociationTabWithDI`: Associação de pontos de coleta a transportadoras
  - `CollectionPointFormDialog`: Formulário para criar/editar pontos de coleta

## Principais Hooks

### Hooks de Gerenciamento de Dados

- `useEstablishmentCasesWithDI`: Gerencia casos de uso para estabelecimentos
- `useCarrierCasesWithDI`: Gerencia casos de uso para transportadoras
- `useCollectionPointCasesWithDI`: Gerencia casos de uso para pontos de coleta
- `useUserCasesWithDI`: Gerencia casos de uso para usuários

### Hooks de UI

- `useIsMobile`: Detecta se o dispositivo é mobile para renderização responsiva
- `useDialogCleanup`: Gerencia limpeza de estado ao fechar diálogos
- `useCarrierForm`: Gerencia formulários de transportadoras

## Guia para Novos Desenvolvedores

### Configuração do Ambiente

```sh
# Passo 1: Clone o repositório
git clone <URL_DO_REPOSITÓRIO>

# Passo 2: Navegue até o diretório do projeto
cd devolvi-app

# Passo 3: Instale as dependências
npm install

# Passo 4: Inicie o servidor de desenvolvimento
npm run dev
```

### Estrutura de Diretórios

```
src/
├── application/         # Casos de uso e DTOs
├── components/          # Componentes React reutilizáveis
├── context/            # Contextos React
├── domain/             # Entidades e interfaces do domínio
├── hooks/              # Hooks personalizados
├── infrastructure/     # Implementação de repositórios e DI
├── integrations/       # Integrações com serviços externos
├── lib/                # Utilitários e funções auxiliares
├── pages/              # Componentes de páginas
├── presentation/       # Componentes e hooks de apresentação
├── services/           # Serviços e APIs
├── styles/             # Estilos e configuração do Tailwind
├── types/              # Definições de tipos TypeScript
└── App.tsx             # Componente raiz da aplicação
```

### Convenções de Código

1. **Nomenclatura**:
   - Componentes: PascalCase (ex: `CollectionPointsTable`)
   - Hooks: camelCase com prefixo "use" (ex: `useCarrierForm`)
   - Arquivos de componentes: PascalCase.tsx
   - Arquivos de hooks: camelCase.ts

2. **Padrões de Componentes**:
   - Componentes funcionais com TypeScript
   - Props bem tipadas com interfaces
   - Separação de responsabilidades

3. **Estilização**:
   - Tailwind CSS para estilos
   - Classes utilitárias em vez de CSS personalizado
   - Componentes shadcn/ui para UI consistente

### Como Implementar Novos Recursos

1. **Adicionar uma Nova Entidade**:
   1. Crie a entidade no domínio (`domain/entities/`)
   2. Defina a interface do repositório (`domain/repositories/`)
   3. Crie os DTOs necessários (`application/dto/`)
   4. Implemente os casos de uso (`application/useCases/`)
   5. Implemente o repositório (`infrastructure/repositories/`)
   6. Configure a injeção de dependência (`infrastructure/di/`)
   7. Crie os hooks de apresentação (`presentation/hooks/`)
   8. Desenvolva os componentes UI (`components/` ou `presentation/components/`)

2. **Modificar um Recurso Existente**:
   1. Identifique os casos de uso afetados
   2. Atualize os DTOs se necessário
   3. Modifique os componentes UI correspondentes

### Boas Práticas

1. **Clean Architecture**:
   - Mantenha a separação clara entre as camadas
   - Evite importar de camadas externas para internas
   - Use interfaces para abstrair dependências

2. **Componentes React**:
   - Mantenha componentes pequenos e focados
   - Extraia lógica para hooks personalizados
   - Use React Query para gerenciamento de estado assíncrono

3. **Responsividade**:
   - Use o hook `useIsMobile` para renderização condicional
   - Implemente views específicas para mobile quando necessário
   - Utilize as classes utilitárias do Tailwind para responsividade

4. **Testes**:
   - Escreva testes para casos de uso
   - Teste componentes independentemente
   - Use mocks para dependências externas

## Contribuição

Para contribuir com o projeto:

1. Crie um branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
2. Faça commit das suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
3. Envie para o branch remoto (`git push origin feature/nova-funcionalidade`)
4. Abra um Pull Request

## Licença

[Especificar licença]

## Contato

[Informações de contato]
