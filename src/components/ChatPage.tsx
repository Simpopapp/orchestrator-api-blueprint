
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Bot, User, MessageCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { ChatMessage } from '../types';
import { useToast } from '@/hooks/use-toast';

const ChatPage: React.FC = () => {
  const { agents, loadAgents, sendMessage, chatHistories } = useApp();
  const { toast } = useToast();
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAgents();
  }, []);

  useEffect(() => {
    if (selectedAgentId) {
      const agentId = parseInt(selectedAgentId);
      const history = chatHistories.find(h => h.agent_id === agentId);
      setMessages(history ? history.messages : []);
    }
  }, [selectedAgentId, chatHistories]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedAgentId || isLoading) return;

    const agentId = parseInt(selectedAgentId);
    const userMessage: ChatMessage = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await sendMessage(agentId, userMessage.content, messages);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedAgent = agents.find(a => a.id.toString() === selectedAgentId);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Chat com IA</h1>
          <p className="text-gray-600 mt-2">
            Converse com seus agentes de IA personalizados
          </p>
        </div>

        {/* Agent Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Selecionar Agente</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
              <SelectTrigger className="w-full md:w-96">
                <SelectValue placeholder="Escolha um agente para conversar" />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id.toString()}>
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4" />
                      <span>{agent.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedAgent && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Agente Selecionado: {selectedAgent.name}</p>
                <p className="text-xs text-blue-600 mt-1">
                  Este agente está pronto para ajudá-lo!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        {selectedAgentId ? (
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Conversa com {selectedAgent?.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-96">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Bot className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">Comece uma conversa!</p>
                    <p className="text-sm">Digite uma mensagem abaixo para começar.</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {msg.role === 'assistant' && (
                            <Bot className="w-4 h-4 mt-0.5 text-gray-600" />
                          )}
                          {msg.role === 'user' && (
                            <User className="w-4 h-4 mt-0.5 text-blue-100" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm">{msg.content}</p>
                            <p className={`text-xs mt-1 ${
                              msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {formatTime(msg.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-xs">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-gray-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !message.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex-1 flex items-center justify-center">
            <CardContent className="text-center">
              <Bot className="w-24 h-24 mx-auto mb-6 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Selecione um Agente
              </h3>
              <p className="text-gray-500">
                Escolha um agente acima para começar a conversar
              </p>
              {agents.length === 0 && (
                <p className="text-sm text-gray-400 mt-4">
                  Você precisa criar pelo menos um agente na página de Gerenciamento primeiro.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
