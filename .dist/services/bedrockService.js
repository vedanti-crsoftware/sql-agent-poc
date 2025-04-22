"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BedrockService = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class BedrockService {
    constructor(configPath) {
        const configRaw = fs_1.default.readFileSync(path_1.default.resolve(configPath), 'utf-8');
        const config = JSON.parse(configRaw);
        this.modelId = config.model_id || 'default-model';
        // const selectedModel = getModelByName('Claude V2', config);
        // this.modelId = selectedModel.model_id;
        this.client = new aws_sdk_1.default.BedrockRuntime({ region: 'us-east-1' });
    }
    async invokeModel(prompt) {
        const body = JSON.stringify({
            prompt,
            max_tokens_to_sample: 5000,
            temperature: 0.2,
            top_p: 0.9,
            anthropic_version: 'bedrock-2023-05-31'
        });
        const response = await this.client.invokeModel({
            modelId: this.modelId,
            contentType: 'application/json',
            accept: 'application/json',
            body
        }).promise();
        const responseBody = JSON.parse(response.body.toString('utf-8'));
        return responseBody.completion?.trim() || "";
    }
}
exports.BedrockService = BedrockService;
