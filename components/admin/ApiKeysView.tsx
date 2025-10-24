import React, { useState, useEffect } from 'react';
import { ApiServiceName, ApiServiceConfig } from '../../types';
import { getApiConfigs, saveApiConfigs } from '../../utils/apiConfig';
import { GoogleGenAI } from "@google/genai";

type TestStatus = 'idle' | 'testing' | 'success' | 'error';

interface ServiceDefinition {
  id: ApiServiceName;
  name: string;
  description: string;
}

const services: ServiceDefinition[] = [
  {
    id: 'contentSearch',
    name: 'Content Search & Summarization',
    description: 'Used by the AI Co-Pilot to search the web for information on a selected topic.',
  },
  {
    id: 'draftGeneration',
    name: 'Post Draft Generation',
    description: 'The primary service for writing post content, titles, and other details.',
  },
  {
    id: 'seoGeneration',
    name: 'SEO Metadata Generation',
    description: 'Generates meta descriptions and keywords based on the post draft.',
  },
];

const AVAILABLE_MODELS = ['gemini-2.5-flash', 'gemini-2.5-pro'];

const maskApiKey = (key: string) => {
  if (!key || key.length < 8) return '••••••••';
  return `${key.slice(0, 4)}••••••••••••••••${key.slice(-4)}`;
};

const ApiKeysView: React.FC = () => {
  const [configs, setConfigs] = useState<Record<ApiServiceName, ApiServiceConfig>>(getApiConfigs());
  const [editingService, setEditingService] = useState<ApiServiceName | null>(null);
  const [formData, setFormData] = useState<ApiServiceConfig>({ apiKey: '', model: '' });
  const [testStatus, setTestStatus] = useState<TestStatus>('idle');
  const [testMessage, setTestMessage] = useState('');

  const handleEdit = (serviceId: ApiServiceName) => {
    setEditingService(serviceId);
    setFormData(configs[serviceId]);
    setTestStatus('idle');
    setTestMessage('');
  };

  const handleCancel = () => {
    setEditingService(null);
  };

  const handleSave = () => {
    if (editingService) {
      const newConfigs = { ...configs, [editingService]: formData };
      setConfigs(newConfigs);
      saveApiConfigs(newConfigs);
      setEditingService(null);
    }
  };

  const handleTestKey = async () => {
    setTestStatus('testing');
    setTestMessage('');
    try {
      if (!formData.apiKey) {
        throw new Error('API Key cannot be empty.');
      }
      const testAi = new GoogleGenAI({ apiKey: formData.apiKey });
      const response = await testAi.models.generateContent({
        model: formData.model,
        contents: "hello",
      });
      if (!response.text) {
          throw new Error('API returned an empty response.');
      }
      setTestStatus('success');
      setTestMessage('Connection successful!');
    } catch (error: any) {
      setTestStatus('error');
      setTestMessage(`Test failed: ${error.message || 'Check console for details.'}`);
      console.error(error);
    }
  };

  const renderServiceCard = (service: ServiceDefinition) => {
    const config = configs[service.id];
    const isEditing = editingService === service.id;

    if (isEditing) {
      return (
        <div className="bg-slate-700 p-4 rounded-lg border border-purple-500">
          <h3 className="text-lg font-bold text-white">{service.name}</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor={`apiKey-${service.id}`} className="block text-sm font-medium text-slate-300 mb-1">API Key</label>
              <input
                type="password"
                id={`apiKey-${service.id}`}
                value={formData.apiKey}
                onChange={(e) => { setFormData({ ...formData, apiKey: e.target.value }); setTestStatus('idle'); }}
                className="w-full bg-slate-800 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label htmlFor={`model-${service.id}`} className="block text-sm font-medium text-slate-300 mb-1">AI Model</label>
              <select
                id={`model-${service.id}`}
                value={formData.model}
                onChange={(e) => { setFormData({ ...formData, model: e.target.value }); setTestStatus('idle'); }}
                className="w-full bg-slate-800 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500"
              >
                {AVAILABLE_MODELS.map(model => <option key={model} value={model}>{model}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button onClick={handleTestKey} disabled={testStatus === 'testing'} className="text-sm bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-full disabled:bg-slate-500">
                {testStatus === 'testing' ? 'Testing...' : 'Test Key'}
              </button>
              {testMessage && (
                <p className={`text-xs font-semibold ${testStatus === 'success' ? 'text-green-400' : 'text-rose-400'}`}>{testMessage}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleCancel} className="text-sm bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-full">Cancel</button>
              <button onClick={handleSave} disabled={testStatus !== 'success'} className="text-sm bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full disabled:bg-slate-500 disabled:cursor-not-allowed">
                Save
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-slate-700/50 p-4 rounded-lg flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">{service.name}</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-md">{service.description}</p>
          <div className="mt-3 flex items-center gap-4 text-xs">
            <span className="bg-slate-600 text-slate-200 font-mono px-2 py-1 rounded-md">{maskApiKey(config.apiKey)}</span>
            <span className="bg-teal-500/20 text-teal-300 font-semibold px-2 py-1 rounded-full">{config.model}</span>
          </div>
        </div>
        <button onClick={() => handleEdit(service.id)} className="text-sm bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-full">
          Edit
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">API Key Management</h2>
        <p className="text-slate-400 mt-1">Configure the Google AI API keys and models used by the AI Co-Pilot.</p>
      </div>
      <div className="space-y-4">
        {services.map(renderServiceCard)}
      </div>
       <div className="text-center text-xs text-slate-500 bg-slate-700/30 p-3 rounded-lg">
        <span className="font-bold">Note:</span> Your API keys are stored securely in your browser's local storage and are not sent to our servers. The "Default" key is pulled from the application's environment configuration.
      </div>
    </div>
  );
};

export default ApiKeysView;
