# AI AGENT SQL OPTIMIZER (PoC)

This is a **Proof of Concept** to demonstrate how an **AI agent** can parse and optimize SQL queries using different foundation models available on AWS Bedrock

## Dependencies
    express : ^5.0.1
    node : ^22.14.1
    ts-node-dev : ^2.0.0
    typescript: ^5.8.3"

## Setup Instructions

#### 1. Clone the Repository
```bash
git clone https://github.com/vedanti-crsoftware/sql-agent-poc.git
```

```bash
cd sql-agent-poc
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Set Enviornment Variables
Your .env file should include

```bash
AWS_ACCESS_KEY_ID=<YOUR_AWS_ACCESS_KEY_ID>
AWS_SECRET_ACCESS_KEY=<YOUR_SECRET_ACCESS_KEY>
AWS_SESSION_TOKEN=<YOUR_AWS_SESSION_TOKEN>
AWS_REGION=<YOUR_AWS_REGION>
```

#### 4. Starting the server

```bash
npm run dev
```

### Technologies Used

- TypeScript
- Node.js
- Express.js
- AWS Bedrock
- ts-node-dev
- dotenv