export interface ModelConfig  {
    name: string;
    model_id: string; 
    provider: string;
}

export interface ModelConfigFile {
    models: ModelConfig[];
}