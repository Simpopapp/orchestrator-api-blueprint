
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AgentsTab from './tabs/AgentsTab';
import PromptsTab from './tabs/PromptsTab';
import KnowledgeBasesTab from './tabs/KnowledgeBasesTab';

const ManagementPage: React.FC = () => {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento</h1>
          <p className="text-gray-600 mt-2">
            Configure e gerencie seus agentes, prompts e bases de conhecimento
          </p>
        </div>

        <Tabs defaultValue="agents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="agents">Agentes</TabsTrigger>
            <TabsTrigger value="prompts">Prompts</TabsTrigger>
            <TabsTrigger value="knowledge-bases">Bases de Conhecimento</TabsTrigger>
          </TabsList>

          <TabsContent value="agents">
            <AgentsTab />
          </TabsContent>

          <TabsContent value="prompts">
            <PromptsTab />
          </TabsContent>

          <TabsContent value="knowledge-bases">
            <KnowledgeBasesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManagementPage;
