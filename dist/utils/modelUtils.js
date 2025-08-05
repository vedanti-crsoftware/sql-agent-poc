"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModelByName = getModelByName;
function getModelByName(name, config) {
    const model = config.models.find(m => m.name === name);
    if (!model) {
        throw new Error(`Model "${name}" not found in config`);
    }
    return model;
}
