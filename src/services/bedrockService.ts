import AWS, { Omics } from 'aws-sdk';
import {JSONLoader} from '../utils/jsonUtils';
import {getModelByName} from '../utils/modelUtils';
import {ModelConfig, ModelConfigFile} from '../types/modelTypes';
import fs from 'fs';
import path from 'path';


export class BedrockService {
     private client: AWS.BedrockRuntime;
     private modelId: string;
    private config: ModelConfigFile;

    constructor(config: ModelConfigFile) {
        this.config = config;
        //const configRaw = fs.readFileSync(configPath,'utf-8');
        //this.config = JSON.parse(configRaw);
        

        console.log("Loaded config:", this.config);
         //this.modelId = this.config.model_id || 'default-model';
        
        const selectedModel = getModelByName('Claude V2',this.config);
        
        this.modelId = selectedModel.model_id;
        console.log("Selected model ID:", this.modelId);
        this.client = new AWS.BedrockRuntime({region: 'us-east-1'});
    }

    async invokeModel(prompt: string): Promise<string> {
        // const accessKey = process.env.AWS_ACCESS_KEY_ID;
        // const secretKey = process.env.AWS_SECRET_ACCESS_KEY;
        // const region = process.env.AWS_REGION;
        // console.log("Model id -> ",this.modelId);
        // //console.log("Model id -> ",this.modelId);
        
        // if(!accessKey || !secretKey || !region) {
        //     throw new Error("Missing AWS creds");
        // }
        console.log("Prompt sent ->", prompt);
        const body = JSON.stringify({
            prompt,
            max_tokens_to_sample:5000,
            temperature:0.2,
            top_p:0.9,
            anthropic_version:'bedrock-2023-05-31'
        });

        //var response = null;
        try {
            console.log('this is the try invoke model ');
            
            const response = await this.client.invokeModel({
                modelId: this.modelId,
                contentType:'application/json',
                accept:'application/json',
                body
            }).promise();
            console.log('this is after try invoke model ');
            

            const responseBody = JSON.parse(response.body!.toString('utf-8'));
            console.log("this is responsebody",responseBody);
            return responseBody.completion?.trim() || "";
        }
        catch(error) {

            console.log("Error invoking Model",error);
            return "Invoking Model failed !";
        }
        

   
    }
}