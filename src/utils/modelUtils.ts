import {Config, Model} from '../types/modelTypes';

export function getModel(name: string, config: Config): Model {
    const model = config.models.find((m)=> m.name == name);
    if(!model) throw new Error('Model not found');
    return model;
}