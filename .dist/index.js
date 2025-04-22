"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const optimizer_1 = __importDefault(require("./routes/optimizer"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use('/optimize_sql', optimizer_1.default);
app.get('/health', (_req, res) => {
    res.json({ status: 'healthy' });
});
app.listen(PORT, () => {
    console.log('Server running at http://localhost:${PORT}');
});
