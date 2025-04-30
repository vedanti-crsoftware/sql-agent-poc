"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BedrockService = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const modelUtils_1 = require("../utils/modelUtils");
const fs_1 = __importDefault(require("fs"));
class BedrockService {
    constructor(configPath) {
        const configRaw = fs_1.default.readFileSync(configPath, 'utf-8');
        this.config = JSON.parse(configRaw);
        console.log("this is config", this.config);
        //this.modelId = this.config.model_id || 'default-model';
        const selectedModel = (0, modelUtils_1.getModelByName)('Claude V2', this.config);
        this.modelId = selectedModel.model_id;
        console.log("this is modelID", this.modelId);
        this.client = new aws_sdk_1.default.BedrockRuntime({ region: 'us-east-1' });
    }
    async invokeModel(prompt) {
        const accessKey = process.env.AWS_ACCESS_KEY_ID;
        const secretKey = process.env.AWS_SECRET_ACCESS_KEY;
        const region = process.env.AWS_REGION;
        console.log("Model id -> ", this.modelId);
        //console.log("Model id -> ",this.modelId);
        if (!accessKey || !secretKey || !region) {
            throw new Error("Missing AWS creds");
        }
        console.log("Prompt sent ->", prompt);
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
//# sourceMappingURL=bedrockService.js.map