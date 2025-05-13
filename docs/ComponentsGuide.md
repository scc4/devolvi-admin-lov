
# Guia de Componentes

Este documento detalha os principais componentes utilizados na aplicação Devolvi, suas responsabilidades e como usá-los.

## Componentes de Layout

### `DashboardLayout`

Componente de layout principal que envolve todas as páginas do dashboard administrativo.

**Responsabilidades:**
- Renderiza a barra lateral (sidebar) em todas as páginas
- Gerencia a responsividade do layout
- Fornece contexto de sidebar para componentes filhos

**Uso:**
```tsx
<DashboardLayout>
  <MinhaConteúdoPágina />
</DashboardLayout>
```

### `AppSidebar`

Barra lateral de navegação principal.

**Responsabilidades:**
- Exibe links para as principais seções do sistema
- Adapta-se a diferentes tamanhos de tela
- Pode ser recolhida em dispositivos móveis

## Componentes de Estabelecimentos

### `EstablishmentsWithDI`

Página principal de estabelecimentos usando injeção de dependências.

**Responsabilidades:**
- Renderiza o cabeçalho com botão de adição
- Exibe a tabela de estabelecimentos 
- Gerencia modais de criação/edição/exclusão
- Gerencia pontos de coleta associados

**Hooks utilizados:**
- `useEstablishmentCasesWithDI`

### `EstablishmentsTable`

Tabela responsiva para listar estabelecimentos.

**Responsabilidades:**
- Renderiza estabelecimentos em formato de tabela (desktop) ou cards (mobile)
- Exibe contagem de pontos de coleta
- Fornece acesso às ações de gerenciamento

**Props:**
- `establishments`: Lista de estabelecimentos
- `loading`: Estado de carregamento
- `onEdit`: Função para editar estabelecimento
- `onDelete`: Função para excluir estabelecimento
- `onManageCollectionPoints`: Função para gerenciar pontos de coleta

## Componentes de Transportadoras

### `EditCarrierDialog`

Modal para criação e edição de transportadoras.

**Responsabilidades:**
- Formulário com abas para dados básicos e cidades atendidas
- Validação de campos obrigatórios
- Gerenciamento de estados e cidades brasileiras

**Props:**
- `carrier`: Dados da transportadora
- `onClose`: Função para fechar o diálogo
- `onSave`: Função para salvar alterações
- `isSubmitting`: Estado de envio do formulário

### `ServedCitiesTab`

Aba para gerenciar cidades atendidas pela transportadora.

**Responsabilidades:**
- Adicionar/remover cidades atendidas
- Buscar estados e cidades do Brasil
- Persistir associações de cidades

**Props:**
- `carrierId`: ID da transportadora
- `isSubmitting`: Estado de envio do formulário

### `CarriersTable`

Tabela responsiva para listar transportadoras.

**Responsabilidades:**
- Exibe transportadoras em formato de tabela ou cards
- Mostra status e contagem de pontos de coleta
- Fornece acesso a ações (editar, excluir, desativar)

**Props:**
- `carriers`: Lista de transportadoras
- `loading`: Estado de carregamento
- `onEdit`, `onDelete`, `onDeactivate`, `onManageCollectionPoints`: Handlers de ação

## Componentes de Pontos de Coleta

### `ManageCollectionPointsDialogWithDI`

Diálogo para gerenciar pontos de coleta com injeção de dependências.

**Responsabilidades:**
- Alternar entre modos de sheet (mobile) e dialog (desktop)
- Renderizar conteúdo de acordo com o contexto (estabelecimento ou transportadora)
- Limpeza adequada de estado ao fechar

**Props:**
- `open`: Estado de abertura do diálogo
- `onOpenChange`: Função para mudar estado de abertura
- `establishment`: Estabelecimento relacionado (opcional)
- `carrierContext`: Contexto de transportadora (opcional)

### `CollectionPointsTabWithDI`

Tab para gerenciamento de pontos de coleta usando DI.

**Responsabilidades:**
- Listar pontos de coleta
- Adicionar/editar/excluir pontos
- Fornecer feedback visual durante carregamento

**Props:**
- `establishmentId`: ID do estabelecimento (opcional)
- `carrierContext`: Contexto de transportadora (opcional)

### `CollectionPointAssociationTabWithDI`

Tab para associar pontos de coleta a transportadoras usando DI.

**Responsabilidades:**
- Listar pontos disponíveis para associação
- Associar/desassociar pontos
- Filtrar por nome e estabelecimento

**Props:**
- `carrierId`: ID da transportadora

### `CollectionPointFormDialog`

Diálogo com formulário para criar/editar pontos de coleta.

**Responsabilidades:**
- Formulário em abas (Informações Básicas, Endereço, Horário de Funcionamento)
- Validação de campos
- Integração com mapa para seleção de localização

**Props:**
- `open`: Estado de abertura do diálogo
- `onOpenChange`: Função para mudar estado de abertura
- `onSubmit`: Função para enviar formulário
- `initialData`: Dados iniciais do ponto de coleta
- `isLoading`: Estado de carregamento
- `carrierContext`: Contexto de transportadora (opcional)

## Componentes de Usuários

### `UsersContentWithDI`

Conteúdo principal da página de usuários usando DI.

**Responsabilidades:**
- Listar usuários
- Gerenciar modais de edição, exclusão, convite, etc.

**Hooks utilizados:**
- `useUserCasesWithDI`

### `UsersTableWithDI`

Tabela de usuários com tratamento adequado para diferentes resoluções.

**Responsabilidades:**
- Exibir usuários em formato de tabela ou cards
- Mostrar status e papel do usuário
- Fornecer acesso a ações de gerenciamento

## Componentes de UI Reutilizáveis

### Componentes shadcn/ui

A aplicação utiliza diversos componentes do shadcn/ui para UI consistente:

- `Dialog`, `Sheet`: Para modais e painéis laterais
- `Table`: Para listas de dados
- `Button`: Para ações
- `Tabs`: Para organização de conteúdo em abas
- `Select`, `Input`, `Checkbox`: Para formulários
- `Card`: Para agrupamento visual de informações
- `Progress`: Para indicadores de carregamento

**Como usar componentes shadcn/ui:**

```tsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Exemplo de uso
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título do Diálogo</DialogTitle>
    </DialogHeader>
    <div>Conteúdo do diálogo...</div>
    <Button>Ação</Button>
  </DialogContent>
</Dialog>
```
