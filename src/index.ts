import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import optimizerRouter from './routes/optimizer';
import serverlessExpress from '@vendia/serverless-express';
const app = express();
const PORT = process.env.PORT || 5000;

//app.use(bodyParser.json());
app.use(express.json());
app.use('/optimize_sql',optimizerRouter);

app.get('/health',(_req,res)=> {
    res.json({status:'healthy'});
});
app.listen(3000)

export default app;