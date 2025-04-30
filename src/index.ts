import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import optimizerRouter from './routes/optimizer';
import serverless from 'serverless-http';

const app = express();
const PORT = process.env.PORT || 3000;

//app.use(bodyParser.json());
app.use(express.json());
app.use('/optimize_sql',optimizerRouter);

app.get('/health',(_req,res)=> {
    res.json({status:'healthy'});
});

export const handler = serverless(app);

if(process.env.IS_OFFLINE){
    app.listen(PORT,()=>{
        console.log(`Server running at http://localhost:${PORT}`);
    })
}
// export const handler = async (event: any, context: any) => {
//     return new Promise((resolve,reject) => {
//         app(event, context, () => {
//             const response = context.getResponse();
//             resolve({
//                 statusCode: response.statusCode,
//                 body: JSON.stringify(response.body),
//             });
//         });
//     });
// };

// app.listen(PORT,()=> {
//     console.log(`Server running at http://localhost:${PORT}`);
// });