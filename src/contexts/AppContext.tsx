
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Agent, Prompt, KnowledgeBase, Model, ChatHistory, ChatMessage } from '../types';

interface AppContextType {
  // Data
  agents: Agent[];
  prompts: Prompt[];
  knowledgeBases: KnowledgeBase[];
  models: Model[];
  chatHistories: ChatHistory[];
  
  // Actions
  createAgent: (agent: Omit<Agent, 'id'>) => Promise<Agent>;
  createPrompt: (prompt: Omit<Prompt, 'id'>) => Promise<Prompt>;
  uploadKnowledgeBase: (file: File, name: string) => Promise<KnowledgeBase>;
  sendMessage: (agentId: number, message: string, history: ChatMessage[]) => Promise<ChatMessage>;
  
  // Loaders
  loadAgents: () => Promise<Agent[]>;
  loadPrompts: () => Promise<Prompt[]>;
  loadKnowledgeBases: () => Promise<KnowledgeBase[]>;
  loadModels: () => Promise<Model[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data para simulação
const MOCK_MODELS: Model[] = [
  { id: 'google/gemma-3-12b-it:free', name: 'Google Gemma 3 (Free)' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku' },
  { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo' },
  { id: 'meta/llama-3-70b', name: 'Llama 3 70B' }
];

const INITIAL_PROMPTS: Prompt[] = [
  { id: 1, name: 'Assistente Geral', content: 'Você é um assistente útil e informativo. Responda de forma clara e precisa.' },
  { id: 2, name: 'Especialista em Código', content: 'Você é um especialista em programação. Ajude com questões técnicas e code reviews.' }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>(INITIAL_PROMPTS);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [models] = useState<Model[]>(MOCK_MODELS);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedAgents = localStorage.getItem('orquestrador_agents');
    const savedPrompts = localStorage.getItem('orquestrador_prompts');
    const savedKnowledgeBases = localStorage.getItem('orquestrador_knowledge_bases');
    const savedChatHistories = localStorage.getItem('orquestrador_chat_histories');

    if (savedAgents) {
      setAgents(JSON.parse(savedAgents));
    }
    if (savedPrompts) {
      setPrompts(JSON.parse(savedPrompts));
    } else {
      localStorage.setItem('orquestrador_prompts', JSON.stringify(INITIAL_PROMPTS));
    }
    if (savedKnowledgeBases) {
      setKnowledgeBases(JSON.parse(savedKnowledgeBases));
    }
    if (savedChatHistories) {
      setChatHistories(JSON.parse(savedChatHistories));
    }
  }, []);

  // Simulate API calls
  const loadAgents = async (): Promise<Agent[]> => {
    // Simula chamada GET /api/agents
    await new Promise(resolve => setTimeout(resolve, 300));
    return agents;
  };

  const loadPrompts = async (): Promise<Prompt[]> => {
    // Simula chamada GET /api/prompts
    await new Promise(resolve => setTimeout(resolve, 200));
    return prompts;
  };

  const loadKnowledgeBases = async (): Promise<KnowledgeBase[]> => {
    // Simula chamada GET /api/knowledge-bases
    await new Promise(resolve => setTimeout(resolve, 200));
    return knowledgeBases;
  };

  const loadModels = async (): Promise<Model[]> => {
    // Simula chamada GET /api/models
    await new Promise(resolve => setTimeout(resolve, 100));
    return models;
  };

  const createAgent = async (agentData: Omit<Agent, 'id'>): Promise<Agent> => {
    // Simula chamada POST /api/agents
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newAgent: Agent = {
      ...agentData,
      id: Date.now() + Math.random()
    };
    
    const updatedAgents = [...agents, newAgent];
    setAgents(updatedAgents);
    localStorage.setItem('orquestrador_agents', JSON.stringify(updatedAgents));
    
    return newAgent;
  };

  const createPrompt = async (promptData: Omit<Prompt, 'id'>): Promise<Prompt> => {
    // Simula chamada POST /api/prompts
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newPrompt: Prompt = {
      ...promptData,
      id: Date.now() + Math.random()
    };
    
    const updatedPrompts = [...prompts, newPrompt];
    setPrompts(updatedPrompts);
    localStorage.setItem('orquestrador_prompts', JSON.stringify(updatedPrompts));
    
    return newPrompt;
  };

  const uploadKnowledgeBase = async (file: File, name: string): Promise<KnowledgeBase> => {
    // Simula chamada POST /api/knowledge-bases/upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newKnowledgeBase: KnowledgeBase = {
      id: Date.now() + Math.random(),
      name
    };
    
    const updatedKnowledgeBases = [...knowledgeBases, newKnowledgeBase];
    setKnowledgeBases(updatedKnowledgeBases);
    localStorage.setItem('orquestrador_knowledge_bases', JSON.stringify(updatedKnowledgeBases));
    
    return newKnowledgeBase;
  };

  const sendMessage = async (agentId: number, message: string, history: ChatMessage[]): Promise<ChatMessage> => {
    // Simula chamada POST /api/chat/{agent_id}
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const agent = agents.find(a => a.id === agentId);
    const prompt = prompts.find(p => p.id === agent?.prompt_id);
    
    const responses = [
      "Esta é uma resposta simulada do agente de IA.",
      `Baseando-me no prompt "${prompt?.name || 'desconhecido'}", posso ajudá-lo com sua solicitação.`,
      "Compreendo sua pergunta. Em um ambiente real, eu processaria esta informação usando o modelo especificado.",
      "Esta é uma demonstração da interface de chat. O backend real implementará a lógica de IA completa.",
      "Excelente pergunta! Quando conectado ao modelo real, fornecerei respostas mais elaboradas."
    ];
    
    const response: ChatMessage = {
      role: 'assistant',
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date()
    };
    
    // Update chat history
    const existingHistory = chatHistories.find(h => h.agent_id === agentId);
    const newMessage: ChatMessage = { role: 'user', content: message, timestamp: new Date() };
    
    if (existingHistory) {
      existingHistory.messages.push(newMessage, response);
    } else {
      setChatHistories(prev => [...prev, {
        agent_id: agentId,
        messages: [newMessage, response]
      }]);
    }
    
    return response;
  };

  return (
    <AppContext.Provider value={{
      agents,
      prompts,
      knowledgeBases,
      models,
      chatHistories,
      createAgent,
      createPrompt,
      uploadKnowledgeBase,
      sendMessage,
      loadAgents,
      loadPrompts,
      loadKnowledgeBases,
      loadModels
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
