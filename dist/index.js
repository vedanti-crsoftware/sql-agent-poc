"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const optimizer_1 = __importDefault(require("./routes/optimizer"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
//app.use(bodyParser.json());
app.use(express_1.default.json());
app.use('/optimize_sql', optimizer_1.default);
app.get('/health', (_req, res) => {
    res.json({ status: 'healthy' });
});
app.listen(3000);
exports.default = app;
