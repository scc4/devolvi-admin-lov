
# Guia para Desenvolvedores

Este guia fornece informações para novos desenvolvedores que estão começando a trabalhar na aplicação Devolvi.

## Primeiros Passos

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

### Configuração da IDE

Recomendamos usar o Visual Studio Code com as seguintes extensões:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript React code snippets

## Entendendo a Arquitetura

### Arquitetura Limpa (Clean Architecture)

O projeto segue os princípios da Arquitetura Limpa, com separação clara entre as camadas:

1. **Entidades** (Domain): Classes ou estruturas de dados que representam os objetos de negócio.
2. **Casos de Uso** (Application): Regras de negócio específicas da aplicação.
3. **Adaptadores** (Infrastructure/Presentation): Conversão de dados entre camadas.
4. **Frameworks e Drivers**: Detalhes técnicos como frameworks, banco de dados, etc.

### Estrutura de Diretórios

- `src/domain/`: Entidades, repositórios e regras de negócio
- `src/application/`: Casos de uso e DTOs
- `src/infrastructure/`: Implementações concretas (repositórios, DI)
- `src/presentation/`: Hooks e componentes de apresentação
- `src/components/`: Componentes React reutilizáveis
- `src/pages/`: Componentes de página (rotas)
- `src/hooks/`: Hooks personalizados
- `src/context/`: Contextos React
- `src/types/`: Tipos TypeScript gerais

### Fluxo de Dados

1. O usuário interage com a UI
2. A UI chama hooks de apresentação 
3. Os hooks chamam casos de uso
4. Os casos de uso chamam repositórios
5. Os repositórios acessam a infraestrutura (Supabase)
6. Dados fluem de volta pela mesma cadeia

## Design System

### Componentes UI

Utilizamos a biblioteca shadcn/ui, que fornece componentes reutilizáveis e customizáveis:

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function MeuFormulário() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome</Label>
        <Input id="nome" placeholder="Digite seu nome" />
      </div>
      <Button>Enviar</Button>
    </div>
  );
}
```

### Estilização com Tailwind CSS

Usamos Tailwind CSS para estilização. Alguns exemplos comuns:

```tsx
// Layout responsivo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Espaçamento
<div className="p-4 m-2 space-y-4">

// Flexbox
<div className="flex items-center justify-between">

// Cores
<div className="bg-primary text-primary-foreground">

// Responsividade
<div className="hidden md:block">
```

## Trabalhando com React

### Hooks Personalizados

Para adicionar um novo hook personalizado:

1. Crie um arquivo no diretório `/src/hooks` (ou `/src/presentation/hooks` para hooks de apresentação).
2. Implemente o hook seguindo a convenção de nomenclatura `useNomeDoHook`.
3. Documente as props e o valor retornado.

Exemplo:

```tsx
import { useState, useEffect } from 'react';

/**
 * Hook para gerenciar o estado de um contador
 * @param initialValue Valor inicial do contador
 * @returns Objeto com o valor atual do contador e funções para manipulá-lo
 */
export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
}
```

### Componentes Responsivos

Recomendamos criar componentes que se adaptem a diferentes tamanhos de tela:

```tsx
import { useIsMobile } from "@/hooks/use-mobile";

function MeuComponente() {
  const { isMobile } = useIsMobile();
  
  return (
    <>
      {isMobile ? (
        <ComponenteVersaoMobile />
      ) : (
        <ComponenteVersaoDesktop />
      )}
    </>
  );
}
```

## Trabalhando com o Backend (Supabase)

### Autenticação

O projeto utiliza autenticação do Supabase. Para verificar se um usuário está autenticado:

```tsx
import { useAuth } from "@/context/AuthContext";

function ComponenteProtegido() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  if (!user) {
    return <div>Acesso negado</div>;
  }
  
  return <div>Conteúdo protegido</div>;
}
```

### Acessando o Banco de Dados

Utilizamos o cliente Supabase para acessar o banco de dados:

```tsx
import { supabase } from "@/integrations/supabase/client";

async function buscarDados() {
  const { data, error } = await supabase
    .from('tabela')
    .select('*')
    .eq('coluna', 'valor');
    
  if (error) {
    console.error('Erro ao buscar dados:', error);
    return [];
  }
  
  return data;
}
```

### Repositórios

Para implementações mais complexas, usamos o padrão Repository para abstrair o acesso ao banco de dados:

1. Defina a interface no domínio (`/src/domain/repositories/`)
2. Implemente a interface na infraestrutura (`/src/infrastructure/repositories/`)
3. Configure a injeção de dependências (`/src/infrastructure/di/`)

## Adicionando Novas Funcionalidades

### Adicionando uma Nova Entidade

1. **Defina a Entidade**:

```tsx
// src/domain/entities/NovaColeção.ts
export class NovaColeção {
  id: string;
  nome: string;
  descrição: string;
  
  constructor(id: string, nome: string, descrição: string) {
    this.id = id;
    this.nome = nome;
    this.descrição = descrição;
  }
}
```

2. **Defina a Interface do Repositório**:

```tsx
// src/domain/repositories/INovaColecaoRepository.ts
import { NovaColeção } from '../entities/NovaColeção';

export interface INovaColecaoRepository {
  getAll(): Promise<NovaColeção[]>;
  getById(id: string): Promise<NovaColeção | null>;
  create(novaColecao: Omit<NovaColeção, 'id'>): Promise<NovaColeção>;
  update(id: string, novaColecao: Partial<NovaColeção>): Promise<NovaColeção>;
  delete(id: string): Promise<void>;
}
```

3. **Crie DTOs**:

```tsx
// src/application/dto/NovaColecaoDTO.ts
export interface NovaColecaoDTO {
  id: string;
  nome: string;
  descricao: string;
}
```

4. **Implemente Casos de Uso**:

```tsx
// src/application/useCases/novaColecao/GetAllNovaColecaoUseCase.ts
import { NovaColeção } from '../../../domain/entities/NovaColeção';
import { INovaColecaoRepository } from '../../../domain/repositories/INovaColecaoRepository';
import { NovaColecaoDTO } from '../../dto/NovaColecaoDTO';

export class GetAllNovaColecaoUseCase {
  constructor(private novaColecaoRepository: INovaColecaoRepository) {}

  async execute(): Promise<NovaColecaoDTO[]> {
    const colecoes = await this.novaColecaoRepository.getAll();
    
    return colecoes.map(colecao => ({
      id: colecao.id,
      nome: colecao.nome,
      descricao: colecao.descrição
    }));
  }
}
```

5. **Implemente o Repositório**:

```tsx
// src/infrastructure/repositories/SupabaseNovaColecaoRepository.ts
import { supabase } from '@/integrations/supabase/client';
import { NovaColeção } from '../../domain/entities/NovaColeção';
import { INovaColecaoRepository } from '../../domain/repositories/INovaColecaoRepository';

export class SupabaseNovaColecaoRepository implements INovaColecaoRepository {
  async getAll(): Promise<NovaColeção[]> {
    const { data, error } = await supabase
      .from('nova_colecao')
      .select('*');
      
    if (error) throw error;
    
    return data.map(item => new NovaColeção(
      item.id,
      item.nome,
      item.descricao
    ));
  }
  
  // Implementar os outros métodos da interface
}
```

6. **Configure a Injeção de Dependências**:

```tsx
// src/infrastructure/di/novaColecaoContainer.ts
import { GetAllNovaColecaoUseCase } from '../../application/useCases/novaColecao/GetAllNovaColecaoUseCase';
import { INovaColecaoRepository } from '../../domain/repositories/INovaColecaoRepository';
import { SupabaseNovaColecaoRepository } from '../repositories/SupabaseNovaColecaoRepository';

export const novaColecaoContainer = {
  getNovaColecaoRepository: (): INovaColecaoRepository => {
    return new SupabaseNovaColecaoRepository();
  },
  
  getGetAllNovaColecaoUseCase: (): GetAllNovaColecaoUseCase => {
    const repository = novaColecaoContainer.getNovaColecaoRepository();
    return new GetAllNovaColecaoUseCase(repository);
  },
  
  // Outros casos de uso
};
```

7. **Crie Hooks de Apresentação**:

```tsx
// src/presentation/hooks/useNovaColecaoCasesWithDI.ts
import { useState, useCallback } from 'react';
import { novaColecaoContainer } from '../../infrastructure/di/novaColecaoContainer';
import type { NovaColecaoDTO } from '../../application/dto/NovaColecaoDTO';

export function useNovaColecaoCasesWithDI() {
  const [colecoes, setColecoes] = useState<NovaColecaoDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const loadColecoes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const getAllUseCase = novaColecaoContainer.getGetAllNovaColecaoUseCase();
      const data = await getAllUseCase.execute();
      setColecoes(data);
    } catch (err) {
      setError('Erro ao carregar coleções');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Implementar outros métodos (criar, atualizar, excluir)
  
  return {
    colecoes,
    loading,
    error,
    loadColecoes,
    // Outros métodos
  };
}
```

8. **Crie Componentes UI**:

```tsx
// src/components/novaColecao/NovaColecaoList.tsx
import { useNovaColecaoCasesWithDI } from '../../presentation/hooks/useNovaColecaoCasesWithDI';
import { useEffect } from 'react';

export function NovaColecaoList() {
  const { colecoes, loading, error, loadColecoes } = useNovaColecaoCasesWithDI();
  
  useEffect(() => {
    loadColecoes();
  }, [loadColecoes]);
  
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  
  return (
    <div>
      <h2>Coleções</h2>
      <ul>
        {colecoes.map(colecao => (
          <li key={colecao.id}>{colecao.nome}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Boas Práticas de Código

### Convenções de Nomenclatura

- **PascalCase** para:
  - Componentes React
  - Classes
  - Interfaces e tipos
  - Enums

- **camelCase** para:
  - Funções
  - Variáveis
  - Props
  - Hooks (sempre começando com 'use')

### Estrutura de Arquivos

- Um componente por arquivo
- Nome do arquivo deve ser igual ao nome do componente
- Agrupar arquivos relacionados em diretórios

### Tratamento de Erros

- Use try/catch para operações que podem falhar
- Forneça feedback visual adequado ao usuário
- Registre erros no console para depuração

### Testes

- Escreva testes para componentes e hooks importantes
- Teste casos de uso de forma isolada
- Use mocks para dependências externas

## Ciclo de Vida de Desenvolvimento

### Fluxo de Trabalho Git

1. Crie um branch para sua feature ou correção
2. Faça pequenos commits com mensagens claras
3. Abra um Pull Request para revisão
4. Após aprovação, faça o merge no branch principal

### Atualizações de Dependências

- Mantenha as dependências atualizadas regularmente
- Teste bem após atualizações importantes
- Prefira updates incrementais para evitar quebras

### Implantação

- O processo de implantação é automatizado
- Builds de produção são otimizados para performance
- A aplicação é hospedada no Supabase e servidores próprios da Devolvi

## Recursos Adicionais

- [Documentação do React](https://reactjs.org/docs/getting-started.html)
- [Documentação do TypeScript](https://www.typescriptlang.org/docs/)
- [Documentação do Tailwind CSS](https://tailwindcss.com/docs)
- [Documentação do Supabase](https://supabase.io/docs)
- [Guia de Arquitetura Limpa](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
