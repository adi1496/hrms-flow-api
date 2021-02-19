const express = require('express');

const ownMiddlewares = require('./utils/middlewares');
const userRouter = require('./routes/userRoutes');

const app = express();

// const parseBody = async (req) => {
//     let data = '';
//     let body;
//     req.on('data', chunk => data += chunk);
//     await req.on('end', async () => {
//         // req.rawBody = data;
//         body = await  JSON.parse(data);
//     });

//     return body;
// }

app.use(ownMiddlewares.bodyParser);

app.get('/', (req, res) => {
    res.send('Hello There');
})
app.use('/api/v1/users', userRouter);

app.use('*', (req, res) => {
    res.send('404. The page doesn\'t exists');
})

module.exports = app;