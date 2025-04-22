import express, {Router, Request, Response} from 'express';
import path from 'path';
import {JSONLoader} from '../utils/jsonUtils';
import {BedrockService} from '../services/bedrockService';

const router = Router();

const promptsPath = path.resolve(__dirname,'../data/prompts.json');
const configPath = path.resolve(__dirname,'../data/config.json');

const promptTemplate = JSONLoader.load(promptsPath).system_prompt;

const bedrockService = new BedrockService(configPath);

interface SqlRequestBody {
    sql_query?:string;
}

router.post('/', async(req: Request<{},{},SqlRequestBody>,res : Response) => {
    
    const sqlQuery = req.body?.sql_query?.trim() || "" ;
    if(!sqlQuery.toLowerCase().startsWith('select')){
        return res.status(400).json({error:'Only SELECT Statemenets are allowed'});
    }

    const prompt = promptTemplate.replace('{sql_query}',sqlQuery);

    try {
        const optimizedQuery = await bedrockService.invokeModel(prompt);
        res.json({optimized_query:optimizedQuery});
    } catch (error: any) {
        console.error('Error optimizing query', error);
        res.status(500).json({error:'An error occured while optimizing the query'});
    }
});

export default router;