
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Bot, Trash2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Agent, Model, Prompt, KnowledgeBase } from '../../types';
import { useToast } from '@/hooks/use-toast';

const AgentsTab: React.FC = () => {
  const { agents, models, prompts, knowledgeBases, createAgent, loadAgents, loadModels, loadPrompts, loadKnowledgeBases } = useApp();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    model_id: '',
    prompt_id: '',
    knowledge_base_id: ''
  });

  useEffect(() => {
    // Load all necessary data
    loadAgents();
    loadModels();
    loadPrompts();
    loadKnowledgeBases();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      await createAgent({
        name: formData.name,
        model_id: formData.model_id,
        prompt_id: parseInt(formData.prompt_id),
        knowledge_base_id: formData.knowledge_base_id ? parseInt(formData.knowledge_base_id) : null
      });

      toast({
        title: "Agente criado",
        description: `O agente "${formData.name}" foi criado com sucesso.`,
      });

      setFormData({ name: '', model_id: '', prompt_id: '', knowledge_base_id: '' });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o agente.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getModelName = (model_id: string) => {
    const model = models.find(m => m.id === model_id);
    return model ? model.name : model_id;
  };

  const getPromptName = (prompt_id: number) => {
    const prompt = prompts.find(p => p.id === prompt_id);
    return prompt ? prompt.name : 'Prompt não encontrado';
  };

  const getKnowledgeBaseName = (knowledge_base_id: number | null) => {
    if (!knowledge_base_id) return 'Nenhuma';
    const kb = knowledgeBases.find(k => k.id === knowledge_base_id);
    return kb ? kb.name : 'Base não encontrada';
  };

  return (
    <div className="space-y-6">
      {/* Create Agent Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Criar Novo Agente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome do Agente</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Assistente de Marketing"
                  required
                />
              </div>

              <div>
                <Label htmlFor="model">Modelo</Label>
                <Select value={formData.model_id} onValueChange={(value) => setFormData({ ...formData, model_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="prompt">Prompt</Label>
                <Select value={formData.prompt_id} onValueChange={(value) => setFormData({ ...formData, prompt_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um prompt" />
                  </SelectTrigger>
                  <SelectContent>
                    {prompts.map((prompt) => (
                      <SelectItem key={prompt.id} value={prompt.id.toString()}>
                        {prompt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="knowledge_base">Base de Conhecimento</Label>
                <Select value={formData.knowledge_base_id} onValueChange={(value) => setFormData({ ...formData, knowledge_base_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma base ou deixe vazio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhuma</SelectItem>
                    {knowledgeBases.map((kb) => (
                      <SelectItem key={kb.id} value={kb.id.toString()}>
                        {kb.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={isCreating} className="w-full md:w-auto">
              {isCreating ? 'Criando...' : 'Criar Agente'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Agents List */}
      <Card>
        <CardHeader>
          <CardTitle>Agentes Criados ({agents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {agents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum agente criado ainda.</p>
              <p className="text-sm">Crie seu primeiro agente usando o formulário acima.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {agents.map((agent) => (
                <div key={agent.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{agent.name}</h3>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p><span className="font-medium">Modelo:</span> {getModelName(agent.model_id)}</p>
                        <p><span className="font-medium">Prompt:</span> {getPromptName(agent.prompt_id)}</p>
                        <p><span className="font-medium">Base de Conhecimento:</span> {getKnowledgeBaseName(agent.knowledge_base_id)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentsTab;
