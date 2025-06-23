
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const AgentsTab: React.FC = () => {
  const { agents, prompts, knowledgeBases, models, createAgent, loadAgents, loadPrompts, loadKnowledgeBases, loadModels } = useApp();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    model_id: '',
    prompt_id: '',
    knowledge_base_id: ''
  });

  React.useEffect(() => {
    loadAgents();
    loadPrompts();
    loadKnowledgeBases();
    loadModels();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.model_id || !formData.prompt_id) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createAgent({
        name: formData.name,
        model_id: formData.model_id,
        prompt_id: parseInt(formData.prompt_id),
        knowledge_base_id: formData.knowledge_base_id ? parseInt(formData.knowledge_base_id) : null
      });
      
      setFormData({
        name: '',
        model_id: '',
        prompt_id: '',
        knowledge_base_id: ''
      });
      
      toast({
        title: "Sucesso",
        description: "Agente criado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o agente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Agente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Agente</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Assistente de Vendas"
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
              <Label htmlFor="knowledge-base">Base de Conhecimento (Opcional)</Label>
              <Select value={formData.knowledge_base_id} onValueChange={(value) => setFormData({ ...formData, knowledge_base_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma base de conhecimento ou deixe vazio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma</SelectItem>
                  {knowledgeBases.map((kb) => (
                    <SelectItem key={kb.id} value={kb.id.toString()}>
                      {kb.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Criar Agente
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Agentes Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          {agents.length === 0 ? (
            <p className="text-gray-500">Nenhum agente criado ainda.</p>
          ) : (
            <div className="space-y-4">
              {agents.map((agent) => (
                <div key={agent.id} className="p-4 border rounded-lg">
                  <h3 className="font-semibold">{agent.name}</h3>
                  <p className="text-sm text-gray-600">Modelo: {agent.model_id}</p>
                  <p className="text-sm text-gray-600">
                    Prompt: {prompts.find(p => p.id === agent.prompt_id)?.name || 'N/A'}
                  </p>
                  {agent.knowledge_base_id && (
                    <p className="text-sm text-gray-600">
                      Base de Conhecimento: {knowledgeBases.find(kb => kb.id === agent.knowledge_base_id)?.name || 'N/A'}
                    </p>
                  )}
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
