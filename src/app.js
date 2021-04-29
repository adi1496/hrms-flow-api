const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const ownMiddlewares = require('./utils/middlewares');
const authRoutes = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const departmentRoutes = require('./routes/departamentRoutes');
const attendaceRoutes = require('./routes/attendanceRoutes');
const platformRouter = require('./routes/platformRoutes');

const authController = require('./controllers/authController');
const globlaErrorHandler = require('./controllers/errorController');


const app = express();

app.use(cors());
app.use(morgan('dev'));

app.use(ownMiddlewares.bodyParser);

app.get('/', (req, res) => {
    res.send('Hello There');
})

// app.use((req, res, next) => {
//     console.log('hey');
// })

app.use('/api/v1/auth', authRoutes);

app.use(authController.protect);
app.use((req, res, next) => {
    // console.log(req.user);
    req.db = mongoose.connection.useDb(req.user.companyId);
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

module.exports = app;