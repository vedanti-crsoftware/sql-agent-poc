import express from 'express';
import bodyParser from 'body-parser';
import optimizerRouter from './routes/optimizer';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use('/optimize_sql',optimizerRouter);

app.get('/health',(_req,res)=> {
    res.json({status:'healthy'});
});

app.listen(PORT,()=> {
    console.log('Server running at http://localhost:${PORT}');
});