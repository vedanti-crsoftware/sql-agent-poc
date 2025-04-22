import {ModelConfig} from '../types/modelTypes';

export function getModelByName(name : string, config: { models: ModelConfig[]}): ModelConfig {
    const model = config.models.find(m => m.name === name);

    if(!model) {
        throw new Error(`Mpdel "${name}" not found in config`);
    }
    return model;
}