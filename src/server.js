const mongoose = require('mongoose');

const app = require('./app');

const port = 3000;
const server = app.listen(port, () => {
    console.log(`The app is listening on port ${port}`);
});

const DB = 'mongodb://localhost:27017/hrms-flow';
mongoose.connect(DB, {  
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database has been connected...');
});