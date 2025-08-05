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
        const sqlQuery = req.body?.sql_query?.trim();
        if (!sqlQuery) {
            return res.status(400).json({ error: 'SQL query is required' });
        }
        if (!isValidSelectSql(sqlQuery)) {
            return res.status(400).json({ error: 'Invalid or disallowed SQL syntax. Only simple SELECT statements are allowed.' });
        }
        const prompts = await jsonUtils_1.JSONLoader.loadFromS3(bucketName, promptKey);
        const config = await jsonUtils_1.JSONLoader.loadFromS3(bucketName, configKey);
        console.log("\n\n\nloading from s3...");
        console.log("\n\n\nloaded prompts from s3...", prompts);
        console.log("\n\n\nloaded config from s3...", config);
        const bedrockService = new bedrockService_1.BedrockService(config);
        console.log("this is the sqlQuery ->", sqlQuery);
        if (!sqlQuery || !sqlQuery.trim().toLowerCase().startsWith('select')) {
            // console.log("Not OKKKKKK");
            return res.status(400).json({ error: 'Only SELECT Statemenets are allowed' });
        }
        const prompt = prompts.default_prompt.replace('{sql_query}', sqlQuery);
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
function isValidSelectSql(sql) {
    if (!sql || typeof sql !== 'string') {
        return false;
    }
    // First check if it starts with SELECT or WITH before more complex processing
    const upperSql = sql.toUpperCase();
    if (!upperSql.startsWith('SELECT') && !upperSql.startsWith('WITH')) {
        return false;
    }
    // Remove comments before pattern matching
    const cleanSql = sql.replace(/--.*$/mg, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();
    if (!cleanSql) {
        return false;
    }
    // Check basic SELECT pattern
    // SELECT ... FROM ... structure is mandatory
    const basicSqlPattern = /^(SELECT|WITH)[\s\S]+?(FROM)[\s\S]+?/i;
    if (!basicSqlPattern.test(cleanSql)) {
        return false;
    }
    // Check for disallowed operations or injection attempts
    const disallowedPatterns = [
        /;[\s]*(DROP|DELETE|UPDATE|INSERT|ALTER|CREATE)/i, // Prevent multi-statement attacks
        /UNION[\s]+(ALL[\s]+)?SELECT/i, // Prevent UNION-based injections
        /INTO[\s]+(OUTFILE|DUMPFILE)/i, // Prevent file operations
        /xp_cmdshell/i, // Prevent command execution in SQL Server
        /exec(\s|\()/i, // Prevent stored procedure execution
        /INFORMATION_SCHEMA/i // Restrict schema information access
    ];
    for (const pattern of disallowedPatterns) {
        if (pattern.test(cleanSql)) {
            return false;
        }
    }
    return true;
}
exports.default = router;
