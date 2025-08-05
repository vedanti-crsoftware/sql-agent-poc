"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_sql_parser_1 = require("node-sql-parser");
try {
    const parser = new node_sql_parser_1.Parser();
    const ast = parser.astify("Select good from ai models for me");
    console.log(ast);
}
catch (error) {
    console.error("Parsing error:", error.message);
}
