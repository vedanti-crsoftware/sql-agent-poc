import fs from 'fs';

export class JSONLoader {
    static load(filepath: string): any {
        const content = fs.readFileSync(filepath, 'utf-8');
        return JSON.parse(content);
    }
}