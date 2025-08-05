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
        const validationResult = validateSelectSql(sqlQuery);
        if (!validationResult.valid) {
            return res.status(400).json({ error: validationResult.errorMessage });
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
        //const cleanOptimized = optimized.replace(/\n/g,'');
        const cleanOptimized = optimized
            .replace(/\n(?!\s*\/\*|\s*\*|\s*\*\/)/g, ' ') // Keep newlines around comments
            .replace(/\s+/g, ' ') // Normalize other whitespace
            .trim();
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
function validateSelectSql(sql) {
    if (!sql || typeof sql !== 'string') {
        return { valid: false, errorMessage: 'SQL query must be a non-empty string' };
    }
    const upperSql = sql.toUpperCase().trim();
    if (!upperSql.startsWith('SELECT') && !upperSql.startsWith('WITH')) {
        return { valid: false, errorMessage: 'Only SELECT or WITH statements are allowed' };
    }
    // //removes single and multiline comments
    // const cleanSql = sql.replace(/--.*$/mg, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();
    // if (!cleanSql) {
    //     return { valid: false, errorMessage: 'SQL query must be a non-empty string' };
    // }
    const cleanSql = upperSql;
    const basicSqlPattern = /^(SELECT|WITH)[\s\S]+?(FROM)[\s\S]+?/i;
    if (!basicSqlPattern.test(cleanSql)) {
        return { valid: false, errorMessage: 'Invalid SQL syntax' };
    }
    let parenCount = 0;
    for (const char of cleanSql) {
        if (char === '(')
            parenCount++;
        if (char === ')')
            parenCount--;
        if (parenCount < 0) {
            return { valid: false, errorMessage: 'Invalid SQL syntax: Unbalanced parentheses' };
        }
    }
    if (parenCount !== 0) {
        return { valid: false, errorMessage: 'Invalid SQL syntax: Unbalanced parentheses' };
    }
    // Check for specific disallowed operations or injection attempts
    const disallowedPatterns = [
        { pattern: /;[\s]*(DROP|DELETE|UPDATE|INSERT|ALTER|CREATE)/i, message: 'SQL injection attempt detected: Multiple statements are not allowed' },
        { pattern: /UNION[\s]+(ALL[\s]+)?SELECT/i, message: 'SQL injection attempt detected: UNION operations are not allowed' },
        { pattern: /INTO[\s]+(OUTFILE|DUMPFILE)/i, message: 'Prohibited operation: File operations are not allowed' },
        { pattern: /xp_cmdshell/i, message: 'Prohibited operation: System commands are not allowed' },
        { pattern: /exec(\s|\()/i, message: 'Prohibited operation: Stored procedures are not allowed' },
        { pattern: /INFORMATION_SCHEMA/i, message: 'Prohibited operation: Schema information access is restricted' },
        { pattern: /sys\./i, message: 'Prohibited operation: System table access is restricted' }
    ];
    for (const { pattern, message } of disallowedPatterns) {
        if (pattern.test(cleanSql)) {
            return { valid: false, errorMessage: message };
        }
    }
    return { valid: true, errorMessage: '' };
}
exports.default = router;
