
# Guia de Hooks Personalizados

Este documento detalha os principais hooks personalizados utilizados na aplicação Devolvi, suas responsabilidades e como usá-los.

## Hooks de UI

### `useIsMobile`

Hook que detecta se a aplicação está sendo visualizada em um dispositivo móvel.

**Funcionalidades:**
- Verifica a largura da janela do navegador
- Retorna um estado booleano indicando se o dispositivo é mobile
- Atualiza automaticamente quando a janela é redimensionada

**Uso:**
```tsx
import { useIsMobile } from "@/hooks/use-mobile";

function MeuComponente() {
  const { isMobile } = useIsMobile();
  
  return (
    <div>
      {isMobile ? (
        <VisualizaçãoMobile />
      ) : (
        <VisualizaçãoDesktop />
      )}
    </div>
  );
}
```

### `useDialogCleanup`

Hook para gerenciar a limpeza de estado quando um diálogo é fechado.

**Funcionalidades:**
- Previne problemas de scroll na página quando diálogos são fechados
- Executa funções de limpeza personalizadas quando o diálogo fecha
- Corrige problemas com body overflow

**Uso:**
```tsx
import { useDialogCleanup } from "@/hooks/useDialogCleanup";

function MeuDialog({ open, onOpenChange }) {
  useDialogCleanup({ 
    open,
    onCleanup: () => {
      // Lógica de limpeza personalizada
      console.log("Diálogo fechado, limpando estado");
    }
  });
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Conteúdo do diálogo */}
    </Dialog>
  );
}
```

## Hooks de Formulários

### `useCarrierForm`

Hook para gerenciar formulários de transportadoras.

**Funcionalidades:**
- Gerencia o estado do formulário
- Carrega cidades com base no estado selecionado
- Formata números de telefone
- Valida campos obrigatórios antes do envio

**Uso:**
```tsx
import { useCarrierForm } from "@/components/carriers/edit-dialog/useCarrierForm";

function CarrierForm({ carrier, onSave }) {
  const {
    formData,
    availableCities,
    isLoadingCities,
    handlePhoneChange,
    handleChange,
    handleSubmit,
    setFormData
  } = useCarrierForm(carrier, onSave);
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Campos do formulário */}
    </form>
  );
}
```

### `useCollectionPointForm`

Hook para gerenciar formulários de pontos de coleta.

**Funcionalidades:**
- Gerencia estado do formulário com múltiplas abas
- Valida campos obrigatórios
- Lida com anexos e coordenadas geográficas

## Hooks de Casos de Uso (DI)

### `useEstablishmentCasesWithDI`

Hook que encapsula os casos de uso de estabelecimentos usando injeção de dependências.

**Funcionalidades:**
- Lista estabelecimentos
- Cria, atualiza e exclui estabelecimentos
- Gerencia estado de carregamento e erro

**Uso:**
```tsx
import { useEstablishmentCasesWithDI } from "@/presentation/hooks/useEstablishmentCasesWithDI";

function EstablishmentsPage() {
  const {
    establishments,
    loading,
    error,
    loadEstablishments,
    handleCreate,
    handleUpdate,
    handleDelete
  } = useEstablishmentCasesWithDI();
  
  return (
    <div>
      {/* UI para listar e gerenciar estabelecimentos */}
    </div>
  );
}
```

### `useCarrierCasesWithDI`

Hook que encapsula os casos de uso de transportadoras usando injeção de dependências.

**Funcionalidades:**
- Lista transportadoras
- Cria, atualiza, desativa e exclui transportadoras
- Gerencia estado de carregamento e erro

**Uso:**
```tsx
import { useCarrierCasesWithDI } from "@/presentation/hooks/useCarrierCasesWithDI";

function CarriersPage() {
  const {
    carriers,
    loading,
    error,
    loadCarriers,
    handleCreate,
    handleUpdate,
    handleDeactivate,
    handleDelete
  } = useCarrierCasesWithDI();
  
  // Implementação da UI
}
```

### `useCollectionPointCasesWithDI`

Hook que encapsula os casos de uso de pontos de coleta usando injeção de dependências.

**Funcionalidades:**
- Lista pontos de coleta
- Filtra pontos por estabelecimento ou transportadora
- Cria, atualiza e exclui pontos de coleta
- Associa pontos a transportadoras
- Gerencia estado de carregamento e erro

**Uso:**
```tsx
import { useCollectionPointCasesWithDI } from "@/presentation/hooks/useCollectionPointCasesWithDI";

function CollectionPointsComponent({ establishmentId, carrierId }) {
  const {
    collectionPoints,
    loading,
    error,
    loadCollectionPoints,
    handleCreate,
    handleUpdate,
    handleDelete,
    isCreating,
    isUpdating
  } = useCollectionPointCasesWithDI({
    establishmentId,
    carrierId
  });
  
  // Implementação da UI
}
```

### `useUserCasesWithDI`

Hook que encapsula os casos de uso de usuários usando injeção de dependências.

**Funcionalidades:**
- Lista usuários
- Convida, desativa e exclui usuários
- Gerencia reset de senha
- Filtra usuários por nome ou email

## Hooks de API

### `useCollectionPoints`

Hook para gerenciar pontos de coleta.

**Funcionalidades:**
- Carrega pontos de coleta
- Cria, atualiza e exclui pontos de coleta
- Gerencia estado de carregamento

**Uso:**
```tsx
import { useCollectionPoints } from "@/hooks/useCollectionPoints";

function CollectionPointsList({ establishmentId }) {
  const {
    collectionPoints,
    isLoading,
    createCollectionPoint,
    updateCollectionPoint,
    deleteCollectionPoint,
    refetch
  } = useCollectionPoints(establishmentId);
  
  return (
    <div>
      {/* UI para listar pontos de coleta */}
    </div>
  );
}
```

### `useCollectionPointAssociation`

Hook para gerenciar associações entre pontos de coleta e transportadoras.

**Funcionalidades:**
- Lista pontos de coleta disponíveis para associação
- Associa e desassocia pontos de coleta
- Filtra pontos por nome ou estabelecimento

## Hooks de Autenticação

### `useAuth`

Hook que gerencia o estado de autenticação do usuário.

**Funcionalidades:**
- Verifica se o usuário está autenticado
- Fornece dados do usuário atual
- Gerencia login, logout e refresh de sessão

**Uso:**
```tsx
import { useAuth } from "@/context/AuthContext";

function PerfilUsuario() {
  const { user, loading, logout } = useAuth();
  
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  return (
    <div>
      <h1>Bem-vindo, {user?.name}!</h1>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

## Boas Práticas no Uso de Hooks

1. **Composição de Hooks**:
   - Combine hooks menores para criar funcionalidades mais complexas
   - Evite duplicação de lógica entre hooks

2. **Separação de Responsabilidades**:
   - Hooks para UI e estados visuais
   - Hooks para lógica de negócio
   - Hooks para acesso a dados

3. **Otimização de Performance**:
   - Use `useMemo` e `useCallback` para evitar recriações desnecessárias
   - Evite renderizações em cascata com hooks bem otimizados

4. **Tratamento de Erros**:
   - Implemente tratamento de erros adequado nos hooks
   - Use React Query para gerenciamento de estado e cache
