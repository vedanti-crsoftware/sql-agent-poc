# AI AGENT SQL OPTIMIZER (PoC)

This is a **Proof of Concept** to demonstrate how an **AI agent** can parse and optimize SQL queries using different foundation models available on AWS Bedrock.

### Key Files and Their Roles

#### 1. services/bedrockService.ts :
- This file contains the BedrockService class which is responsible for reading a configuration file (/data/config.json), and extracting model details using (/utils/modelUtils.ts), and setting up the AWS client for interaction with AWS Bedrock services

#### 2. routes/optimizer.ts
- This file acts as a route handler for POST request hitting /optimize_sql. 
- It initalizes a BedrockService instance using config.json
- Loads the predefined system_prompt from (/data/prompts.json) and replaces the placeholder (sql_query) int the prompt with the user's SQL query
- It accepts a JSON payload with sql_query field, checks and reject if query does not start with SELECT
- Sends final prompt to bedrock model and returns optimized sql query

#### 3. utils/modelUtils.ts :
- This file contains the helper function (getModelByName) for interacting with model data. This function accepts a model name and ModelConfigFile object(Interface defined in types/modelTypes.ts) and returns corressponding ModelConfig (Interface defined in types/modelTypes.ts) based on model name, throws error if the model is not found

#### 4. types/modelTypes.ts :
- This file contains the TypeScript interfaces (ModelConfig and ModelConfigFile) which defines the structure of config data
- ModelConfig : Represents a single model's details like name, provider and model_id
- ModelConfigFile : Represents the full configuration i.e an array of ModelCinfig Objects

#### 5. index.ts :
- This is the main entry point of application, it initalizes an express application, applies middleware (express.json() and bodyParser.json()). It also register the route '/optimize_sql' and '/health'. It starts the server on specified port.

#### 6. data/config.json :
- Contains avaialable model configurations. structure is of ModelConfigFile interface defined in types/modelTypes.ts. It is an array of model with name, provider, model_id.


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