
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, FileText, Trash2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const PromptsTab: React.FC = () => {
  const { prompts, createPrompt, loadPrompts } = useApp();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    content: ''
  });

  useEffect(() => {
    loadPrompts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      await createPrompt({
        name: formData.name,
        content: formData.content
      });

      toast({
        title: "Prompt criado",
        description: `O prompt "${formData.name}" foi criado com sucesso.`,
      });

      setFormData({ name: '', content: '' });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o prompt.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Prompt Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Criar Novo Prompt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="prompt-name">Nome do Prompt</Label>
              <Input
                id="prompt-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Especialista em Marketing Digital"
                required
              />
            </div>

            <div>
              <Label htmlFor="prompt-content">Conteúdo do Prompt</Label>
              <Textarea
                id="prompt-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Você é um especialista em marketing digital. Sempre responda com estratégias práticas e baseadas em dados..."
                rows={6}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Defina como o agente deve se comportar e responder às perguntas.
              </p>
            </div>

            <Button type="submit" disabled={isCreating} className="w-full md:w-auto">
              {isCreating ? 'Criando...' : 'Criar Prompt'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Prompts List */}
      <Card>
        <CardHeader>
          <CardTitle>Prompts Criados ({prompts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {prompts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum prompt criado ainda.</p>
              <p className="text-sm">Crie seu primeiro prompt usando o formulário acima.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {prompts.map((prompt) => (
                <div key={prompt.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{prompt.name}</h3>
                      <p className="text-gray-600 mt-2 line-clamp-3">{prompt.content}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {prompt.content.length} caracteres
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
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

export default PromptsTab;
