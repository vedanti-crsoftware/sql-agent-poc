import {ModelConfig, ModelConfigFile} from '../types/modelTypes';

export function getModelByName(name : string, config: ModelConfigFile): ModelConfig {
    const model = config.models.find(m => m.name === name);

    if(!model) {
        throw new Error(`Model "${name}" not found in config`);
    }
    return model;
}