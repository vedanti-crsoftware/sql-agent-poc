import express, {Router, Request, Response, response} from 'express';
import path from 'path';
import {JSONLoader} from '../utils/jsonUtils';
import {BedrockService} from '../services/bedrockService';

const router = express.Router();


interface SqlRequestBody {
    sql_query?:string;
}

const bucketName = 'sql-optimizer-configs';
const promptKey = 'data/prompts.json';
const configKey = 'data/config.json';


// const promptsPath = path.resolve(__dirname,'../data/prompts.json');
// const configPath = path.resolve(__dirname,'../data/config.json');

// const bedrockService = new BedrockService(configPath);

// const promptTemplate = JSONLoader.load(promptsPath).system_prompt5;


router.post('/', async(req : Request,res: any) => {
    
    try {

        const prompts = await JSONLoader.loadFromS3(bucketName, promptKey);
        const config = await JSONLoader.loadFromS3(bucketName, configKey);
        console.log("\n\n\nloading from s3...");
        console.log("\n\n\nloaded prompts from s3...", prompts);
        console.log("\n\n\nloaded config from s3...",config);
        
        const bedrockService = new BedrockService(config);

        const sqlQuery = req.body?.sql_query?.trim();
            console.log("this is the sqlQuery ->",sqlQuery);
            if(!sqlQuery || !sqlQuery.trim().toLowerCase().startsWith('select')){
               // console.log("Not OKKKKKK");
            return res.status(400).json({error:'Only SELECT Statemenets are allowed'});
        }
        const prompt = prompts.system_prompt5.replace('{sql_query}',sqlQuery);
        console.log("This is final prompt ->>>>>>",prompt);
        const optimized = await bedrockService.invokeModel(prompt);
         const cleanOptimized = optimized.replace(/\n/g,'');
        //const cleanOptimized = optimized.replace(/\s+/g,'').trim();
        console.log('this is the response ->',cleanOptimized);
        console.log('SENDING YOU RESPONESEE ->');
        
        return res.json({optimized_query: cleanOptimized});
    } catch (err) {
        console.error(err);
        return res.status(500).json({error:'Optimization failed'});
    }
});

export default router;