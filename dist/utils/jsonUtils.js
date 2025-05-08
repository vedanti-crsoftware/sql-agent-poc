"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONLoader = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const s3 = new aws_sdk_1.default.S3();
class JSONLoader {
    static async loadFromS3(bucket, key) {
        const data = await s3.getObject({ Bucket: bucket, Key: key }).promise();
        return JSON.parse(data.Body.toString('utf-8'));
    }
}
exports.JSONLoader = JSONLoader;
// export class JSONLoader {
//     static load(filepath: string): any {
//         const content = fs.readFileSync(filepath, 'utf-8');
//         return JSON.parse(content);
//     }
// }
