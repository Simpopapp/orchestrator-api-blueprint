
# Relatório de Handoff do Frontend - Orquestrador

## 1. Contrato de API Implementado

Confirmo que o frontend está fazendo chamadas para os seguintes endpoints, esperando os formatos de dados definidos nas interfaces TypeScript:

- [x] `GET /api/models` -> `Model[]`
- [x] `GET /api/agents` -> `Agent[]`
- [x] `POST /api/agents` -> `Agent`
- [x] `GET /api/prompts` -> `Prompt[]`
- [x] `POST /api/prompts` -> `Prompt`
- [x] `GET /api/knowledge-bases` -> `KnowledgeBase[]`
- [x] `POST /api/knowledge-bases/upload` -> `KnowledgeBase`
- [x] `POST /api/chat/{agent_id}` -> `ChatMessage`

## 2. Estrutura de Dados (TypeScript)

As interfaces de dados utilizadas no projeto estão localizadas em `src/types.ts` e são as seguintes:

```typescript
export interface Agent {
  id: number;
  name: string;
  model_id: string; // Ex: "google/gemma-3-12b-it:free"
  prompt_id: number;
  knowledge_base_id: number | null;
}

export interface Prompt {
  id: number;
  name: string;
  content: string;
}

export interface KnowledgeBase {
  id: number;
  name: string;
}

export interface Model {
  id: string; // O próprio ID do modelo, ex: "google/gemma-3-12b-it:free"
  name: string; // Um nome amigável, ex: "Google Gemma 3 (Free)"
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatHistory {
  agent_id: number;
  messages: ChatMessage[];
}
```

## 3. Simulações e Mock Data

Para a funcionalidade da preview, as seguintes simulações foram implementadas:

- **Fonte de Dados:** Usei o localStorage para persistir agentes, prompts e bases de conhecimento.
- **Context API:** Implementei um AppContext em `src/contexts/AppContext.tsx` que simula todas as chamadas de API.
- **Mock de Modelos:** A chamada a `/api/models` retorna uma lista fixa que inclui:
  - `google/gemma-3-12b-it:free` (Google Gemma 3 Free)
  - `anthropic/claude-3-haiku` (Claude 3 Haiku)
  - `openai/gpt-4-turbo` (GPT-4 Turbo)
  - `meta/llama-3-70b` (Llama 3 70B)
- **Simulação do Chat:** O endpoint de chat retorna respostas simuladas após 1.5 segundos, incluindo referências ao agente e prompt selecionados.
- **Prompts Iniciais:** Dois prompts padrão são criados automaticamente: "Assistente Geral" e "Especialista em Código".

## 4. Funcionalidades Implementadas

### 4.1 Página de Gerenciamento (/management)
- **Aba Agentes:** Formulário completo para criar agentes com seleção de modelo, prompt e base de conhecimento
- **Aba Prompts:** Interface para criar e visualizar prompts personalizados
- **Aba Bases de Conhecimento:** Sistema de upload de arquivos com validação de tipos

### 4.2 Página de Chat (/chat)
- Interface de chat em tempo real
- Seleção dinâmica de agentes
- Histórico de conversas persistente
- Indicadores visuais de loading
- Scroll automático para novas mensagens

### 4.3 Layout e Navegação
- Sidebar com navegação entre páginas
- Design responsivo
- Estados de loading e error handling
- Toasts para feedback do usuário

## 5. Bibliotecas Adicionais

As seguintes funcionalidades foram implementadas usando as bibliotecas já disponíveis no projeto:

- **@radix-ui/react-tabs** para as abas na página de gerenciamento
- **@radix-ui/react-select** para os dropdowns de seleção
- **@radix-ui/react-toast** para notificações
- **react-router-dom** para navegação
- **lucide-react** para ícones
- **tailwindcss** para estilização

## 6. Pontos de Atenção para o Backend

### 6.1 Endpoint Crítico: GET /api/models
Este é o endpoint mais importante, pois toda a criação de agentes depende dele. O frontend espera receber uma lista de modelos disponíveis no formato:

```typescript
[
  { id: "google/gemma-3-12b-it:free", name: "Google Gemma 3 (Free)" },
  { id: "anthropic/claude-3-haiku", name: "Claude 3 Haiku" }
]
```

### 6.2 Upload de Arquivos
O endpoint `POST /api/knowledge-bases/upload` deve aceitar FormData com:
- `file`: o arquivo enviado
- `name`: nome da base de conhecimento

### 6.3 Chat em Tempo Real
O endpoint `POST /api/chat/{agent_id}` recebe:
```typescript
{
  message: string,
  history: ChatMessage[]
}
```

E deve retornar:
```typescript
{
  role: 'assistant',
  content: string
}
```

### 6.4 Relacionamentos
- Cada Agent referencia um Prompt pelo `prompt_id`
- Cada Agent pode opcionalmente referenciar uma KnowledgeBase pelo `knowledge_base_id`
- O `model_id` em Agent deve corresponder ao `id` de um Model disponível

## 7. Estados de Loading e Error

O frontend está preparado para lidar com:
- Estados de loading em todas as operações
- Exibição de mensagens de erro via toast
- Retry automático em algumas operações
- Validação de formulários

## 8. Próximos Passos

1. **Backend:** Implementar todos os endpoints listados seguindo exatamente os contratos TypeScript
2. **Integração:** Substituir as simulações por chamadas reais à API
3. **Autenticação:** Adicionar sistema de autenticação se necessário
4. **Deploy:** Configurar pipeline de deploy com variáveis de ambiente para a URL da API

## 9. Arquivos Principais

- `src/types.ts` - Definições de tipos TypeScript
- `src/contexts/AppContext.tsx` - Simulação da API e gerenciamento de estado
- `src/components/Layout.tsx` - Layout principal com sidebar
- `src/components/ManagementPage.tsx` - Página de gerenciamento
- `src/components/ChatPage.tsx` - Interface de chat
- `src/components/tabs/` - Componentes das abas de gerenciamento

O frontend está 100% funcional e pronto para integração com o backend real. Todos os contratos de API estão documentados e implementados no código.
