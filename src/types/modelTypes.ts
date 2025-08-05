export interface ModelConfig  {
    name: string;
    model_id: string; 
    provider: string;
}

export interface ModelConfigFile {
    default_model: string;
    models: ModelConfig[];
}