import { ApiServiceName, ApiServiceConfig } from '../types';

const API_CONFIG_KEY = 'fanzAddaApiConfig';

const DEFAULT_MODEL = 'gemini-2.5-flash';

// This provides the fallback mechanism
const getDefaultConfig = (): ApiServiceConfig => ({
  apiKey: process.env.API_KEY || '',
  model: DEFAULT_MODEL,
});

export const getApiConfigs = (): Record<ApiServiceName, ApiServiceConfig> => {
  try {
    const storedConfig = localStorage.getItem(API_CONFIG_KEY);
    const parsedConfig = storedConfig ? JSON.parse(storedConfig) : {};
    // Ensure all services have a config, falling back to default
    return {
      contentSearch: parsedConfig.contentSearch || getDefaultConfig(),
      draftGeneration: parsedConfig.draftGeneration || getDefaultConfig(),
      seoGeneration: parsedConfig.seoGeneration || getDefaultConfig(),
    };
  } catch (error) {
    console.error("Failed to parse API configs from localStorage", error);
    return {
      contentSearch: getDefaultConfig(),
      draftGeneration: getDefaultConfig(),
      seoGeneration: getDefaultConfig(),
    };
  }
};

export const saveApiConfigs = (configs: Record<ApiServiceName, ApiServiceConfig>) => {
  try {
    localStorage.setItem(API_CONFIG_KEY, JSON.stringify(configs));
  } catch (error) {
    console.error("Failed to save API configs to localStorage", error);
  }
};

// This is the key function for the AI generator
export const getApiService = (service: ApiServiceName): ApiServiceConfig => {
  const configs = getApiConfigs();
  return configs[service];
};