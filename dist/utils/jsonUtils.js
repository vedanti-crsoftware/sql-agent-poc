"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONLoader = void 0;
const fs_1 = __importDefault(require("fs"));
class JSONLoader {
    static load(filepath) {
        const content = fs_1.default.readFileSync(filepath, 'utf-8');
        return JSON.parse(content);
    }
}
exports.JSONLoader = JSONLoader;
//# sourceMappingURL=jsonUtils.js.map