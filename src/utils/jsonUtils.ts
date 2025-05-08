import fs from 'fs';
import AWS from 'aws-sdk';

const s3 = new AWS.S3();


export class JSONLoader {
    static async loadFromS3(bucket: string, key: string): Promise<any> {
        const data = await s3.getObject({Bucket: bucket, Key: key}).promise();
        return JSON.parse(data.Body!.toString('utf-8'));
    }
}

// export class JSONLoader {
//     static load(filepath: string): any {
//         const content = fs.readFileSync(filepath, 'utf-8');
//         return JSON.parse(content);
//     }
// }