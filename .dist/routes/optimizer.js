"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const jsonUtils_1 = require("../utils/jsonUtils");
const bedrockService_1 = require("../services/bedrockService");
const router = (0, express_1.Router)();
const promptsPath = path_1.default.resolve(__dirname, '../data/prompts.json');
const configPath = path_1.default.resolve(__dirname, '../data/config.json');
const promptTemplate = jsonUtils_1.JSONLoader.load(promptsPath).system_prompt;
const bedrockService = new bedrockService_1.BedrockService(configPath);
router.post('/', async (req, res) => {
    const sqlQuery = req.body?.sql_query?.trim() || "";
    if (!sqlQuery.toLowerCase().startsWith('select')) {
        return res.status(400).json({ error: 'Only SELECT Statemenets are allowed' });
    }
    const prompt = promptTemplate.replace('{sql_query}', sqlQuery);
    try {
        const optimizedQuery = await bedrockService.invokeModel(prompt);
        res.json({ optimized_query: optimizedQuery });
    }
    catch (error) {
        console.error('Error optimizing query', error);
        res.status(500).json({ error: 'An error occured while optimizing the query' });
    }
});
exports.default = router;
