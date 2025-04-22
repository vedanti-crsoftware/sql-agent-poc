import AWS, { Omics } from 'aws-sdk';
import {JSONLoader} from '../utils/jsonUtils';
import {getModelByName} from '../utils/modelUtils';
import {ModelConfig} from '../types/modelTypes';
import fs from 'fs';
import path from 'path';


export class BedrockService {
     private client: AWS.BedrockRuntime;
     private modelId: string;
    private config: ModelConfig;

    constructor(configPath: string) {
        // const configRaw = fs.readFileSync(path.resolve(configPath),'utf-8');
        // const config = JSON.parse(configRaw);
      
        this.config = JSON.parse(fs.readFileSync(configPath,'utf-8'));
        this.modelId = this.config.model_id || 'default-model';
        // const selectedModel = getModelByName('Claude V2', config);
        // this.modelId = selectedModel.model_id;
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