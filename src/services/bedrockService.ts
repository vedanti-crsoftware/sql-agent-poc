import AWS from 'aws-sdk';
import {JSONLoader} from '../utils/jsonUtils';
import {getModelByName} from '../utils/modelUtils';
import {modelConfig} from '../types/modelTypes';

export class BedrockService {
    private client: AWS.BedrockRuntime;
    private modelId: string;

    constructor(configPath: string) {
        const config = JSONLoader.load(configPath);
        const selectedModel = getModelByName('Claude V2', config);
        this.modelId = selectedModel.model_id;
        this.client = new AWS.BedrockRuntime({region: 'us-east-1'});
    }

    async invokeModel(prompt: string): Promise<string> {
        const body = JSON.stringify({
            prompt,
            max_tokens_to_sample:5000,
            temperature:0.2,
            top_p:0.9,
            anthropic_version: 'bedrock-2023-05-31'
        });

        const response = await this.client.invokeModel({
            modelId: this.modelId,
            contentType:'application/json',
            accept:'application/json',
            body
        }).promise();

        const responseBody = JSON.parse(response.body!.toString('utf-8'));
        return responseBody.completion?.trim() || "";
    }
}