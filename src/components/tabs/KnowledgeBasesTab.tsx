
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Database, Upload, File, Trash2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const KnowledgeBasesTab: React.FC = () => {
  const { knowledgeBases, uploadKnowledgeBase, loadKnowledgeBases } = useApp();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    file: null as File | null
  });

  useEffect(() => {
    loadKnowledgeBases();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) return;

    setIsUploading(true);

    try {
      await uploadKnowledgeBase(formData.file, formData.name);

      toast({
        title: "Base de conhecimento criada",
        description: `A base "${formData.name}" foi criada com sucesso.`,
      });

      setFormData({ name: '', file: null });
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar a base de conhecimento.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Criar Nova Base de Conhecimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="kb-name">Nome da Base</Label>
              <Input
                id="kb-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Documentação do Produto"
                required
              />
            </div>

            <div>
              <Label htmlFor="file-upload">Arquivo</Label>
              <div className="mt-1">
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.txt,.doc,.docx,.md"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Formatos suportados: PDF, TXT, DOC, DOCX, MD (máx. 10MB)
              </p>
            </div>

            {formData.file && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <File className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">{formData.file.name}</span>
                  <span className="text-xs text-blue-600">({formatFileSize(formData.file.size)})</span>
                </div>
              </div>
            )}

            <Button type="submit" disabled={isUploading || !formData.file} className="w-full md:w-auto">
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? 'Fazendo upload...' : 'Criar Base de Conhecimento'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Knowledge Bases List */}
      <Card>
        <CardHeader>
          <CardTitle>Bases de Conhecimento ({knowledgeBases.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {knowledgeBases.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma base de conhecimento criada ainda.</p>
              <p className="text-sm">Faça upload do seu primeiro arquivo usando o formulário acima.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {knowledgeBases.map((kb) => (
                <div key={kb.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Database className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{kb.name}</h3>
                        <p className="text-sm text-gray-500">Base de conhecimento ativa</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Ver Detalhes
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

export default KnowledgeBasesTab;
