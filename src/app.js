const express = require('express');
const mongoose = require('mongoose');

const ownMiddlewares = require('./utils/middlewares');
const userRouter = require('./routes/userRoutes');
const departmentRoutes = require('./routes/departamentRoutes');
const attendaceRoutes = require('./routes/attendanceRoutes');
const platformRouter = require('./routes/platformRoutes');
const globlaErrorHandler = require('./controllers/errorController');

const app = express();

app.use(ownMiddlewares.bodyParser);

app.get('/', (req, res) => {
    res.send('Hello There');
})

// app.use(async (req, res, next) => {
    
//     let DB;
//     if(process.env.NODE_ENV === 'development') {
//         DB = process.env.DEV_DB // change this after finish the app
//         DB = DB.replace('<password>', process.env.DEV_DB_PASSWORD);
//         // console.log(DB);
//     }else {
//         DB = process.env.PROD_DB
//     }
    
//     if(req.url === '/api/v1/users/signup-company') {
//         console.log(req.url);
//         if(mongoose.connection.readyState === 1){
//             await mongoose.connection.close();
//             console.log('Database disconnected');
//         }
//         req.databaseName = DB;
//         return next()
//     };

//     console.log(mongoose.connection.readyState);
//     if(mongoose.connection.readyState === 1){
//         await mongoose.connection.close();
//         console.log('Database disconnected');
//     }

//     DB = DB.replace('<database_name>', 'req');
//     mongoose.connect(DB, {  
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useFindAndModify: false,
//         useUnifiedTopology: true
//     }).then(() => {
//         console.log('Database has been connected...');
//         next();
//     });
//     // next();
// })


app.use(async (req, res, next) => {
    let DB;
    DB = process.env.DEV_DB // change this after finish the app
    DB = DB.replace('<password>', process.env.DEV_DB_PASSWORD);
    
    if(req.url === '/api/v1/users/signup-company') {
        console.log(req.url);
        req.databaseName = DB;
        return next();
    };
    
    DB = DB.replace('<database_name>', '1234hrflow');
    const db = await mongoose.createConnection(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });



    console.log(db);
    req.db = db;
    next();
})

app.use('/api/v1/users', userRouter);
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/attendance', attendaceRoutes);
app.use('/platform/v1/taxes', platformRouter);

app.use('*', (req, res) => {
    res.send('404. The page doesn\'t exists');
})

app.use(globlaErrorHandler);

app.use((req,res,next) => {
    mongoose.connection.close().then(() => console.log('Disconected'));
})

module.exports = app;