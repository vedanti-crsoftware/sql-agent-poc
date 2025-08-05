import { Parser } from 'node-sql-parser';

try {
  const parser = new Parser();
  const ast = parser.astify("Select good from ai models for me");
  console.log(ast);
} catch (error : any) {
  console.error("Parsing error:", error.message);
}