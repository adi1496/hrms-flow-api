const express = require('express');

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
app.use('/api/v1/users', userRouter);
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/attendance', attendaceRoutes);
app.use('/platform/v1/taxes', platformRouter);

app.use('*', (req, res) => {
    res.send('404. The page doesn\'t exists');
})

app.use(globlaErrorHandler);

module.exports = app;