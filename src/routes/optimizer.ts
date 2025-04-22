import express, {Router, Request, Response} from 'express';
import path from 'path';
import {JSONLoader} from '../utils/jsonUtils';
import {BedrockService} from '../services/bedrockService';

const router = express.Router();


interface SqlRequestBody {
    sql_query?:string;
}

const promptsPath = path.resolve(__dirname,'../data/prompts.json');
const configPath = path.resolve(__dirname,'../data/config.json');

const bedrockService = new BedrockService(configPath);

const promptTemplate = JSONLoader.load(promptsPath).system_prompt;


router.post('/', async(req : Request,res: any) => {
    
    try {
        const sqlQuery = req.body?.sql_query?.trim();
            console.log("this is the sqlQuery ->",sqlQuery);
            if(!sqlQuery || !sqlQuery.trim().toLowerCase().startsWith('select')){
               // console.log("OKKKKKK");
            return res.status(400).json({error:'Only SELECT Statemenets are allowed'});
        }
        const prompt = promptTemplate.replace('{sql_query}',sqlQuery);
        console.log("This is final prompt ->>>>>>",prompt);
        const optimized = await bedrockService.invokeModel(prompt);
        return res.json({optimized_query: optimized});
    } catch (err) {
        console.error(err);
        return res.status(500).json({error:'Optimization failed'});
    }
});

export default router;