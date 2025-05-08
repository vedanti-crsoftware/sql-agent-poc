"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonUtils_1 = require("../utils/jsonUtils");
const bedrockService_1 = require("../services/bedrockService");
const router = express_1.default.Router();
const bucketName = 'sql-optimizer-configs';
const promptKey = 'data/prompts.json';
const configKey = 'data/config.json';
// const promptsPath = path.resolve(__dirname,'../data/prompts.json');
// const configPath = path.resolve(__dirname,'../data/config.json');
// const bedrockService = new BedrockService(configPath);
// const promptTemplate = JSONLoader.load(promptsPath).system_prompt5;
router.post('/', async (req, res) => {
    try {
        const prompts = await jsonUtils_1.JSONLoader.loadFromS3(bucketName, promptKey);
        const config = await jsonUtils_1.JSONLoader.loadFromS3(bucketName, configKey);
        const bedrockService = new bedrockService_1.BedrockService(config);
        const sqlQuery = req.body?.sql_query?.trim();
        console.log("this is the sqlQuery ->", sqlQuery);
        if (!sqlQuery || !sqlQuery.trim().toLowerCase().startsWith('select')) {
            // console.log("Not OKKKKKK");
            return res.status(400).json({ error: 'Only SELECT Statemenets are allowed' });
        }
        const prompt = prompts.system_prompt5.replace('{sql_query}', sqlQuery);
        console.log("This is final prompt ->>>>>>", prompt);
        const optimized = await bedrockService.invokeModel(prompt);
        const cleanOptimized = optimized.replace(/\n/g, '');
        //const cleanOptimized = optimized.replace(/\s+/g,'').trim();
        console.log('this is the response ->', cleanOptimized);
        console.log('SENDING YOU RESPONESEE ->');
        return res.json({ optimized_query: cleanOptimized });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Optimization failed' });
    }
});
exports.default = router;
