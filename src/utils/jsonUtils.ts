import fs from 'fs';

export function loadJson<T=any>(filePath:string):T {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
}