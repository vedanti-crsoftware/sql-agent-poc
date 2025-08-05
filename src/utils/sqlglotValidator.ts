import { spawnSync } from 'child_process';
import path from 'path';

export function validateSqlWithSqlglot(sql: string): boolean {
    const scriptPath = path.resolve(__dirname, '../test/sqlglot_test.py');
    const result = spawnSync('python', [scriptPath, sql], { encoding: 'utf-8' });
    if (result.error) {
        console.error('Error running sqlglot:', result.error);
        return false;
    }
    return result.stdout.trim() === 'True';
}