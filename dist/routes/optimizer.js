"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const jsonUtils_1 = require("../utils/jsonUtils");
const bedrockService_1 = require("../services/bedrockService");
const router = express_1.default.Router();
const promptsPath = path_1.default.resolve(__dirname, '../data/prompts.json');
const configPath = path_1.default.resolve(__dirname, '../data/config.json');
const bedrockService = new bedrockService_1.BedrockService(configPath);
const promptTemplate = jsonUtils_1.JSONLoader.load(promptsPath).system_prompt2;
router.post('/', async (req, res) => {
    try {
        const sqlQuery = req.body?.sql_query?.trim();
        console.log("this is the sqlQuery ->", sqlQuery);
        if (!sqlQuery || !sqlQuery.trim().toLowerCase().startsWith('select')) {
            // console.log("Not OKKKKKK");
            return res.status(400).json({ error: 'Only SELECT Statemenets are allowed' });
        }
        const prompt = promptTemplate.replace('{sql_query}', sqlQuery);
        console.log("This is final prompt ->>>>>>", prompt);
        const optimized = await bedrockService.invokeModel(prompt);
        const cleanOptimized = optimized.replace(/\n/g, '');
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
