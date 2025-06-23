
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
