const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');
const { param } = require('./routes/userRoutes');
const { path } = require('./modules/userModule');

dotenv.config({path: `${__dirname}/.config.env`});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`The app is listening on port ${port}`);
});

// log the node environment
console.log(process.env.NODE_ENV);

// let DB;
// if(process.env.NODE_ENV === 'development') {
//     DB = process.env.LOCAL_DB // change this after finish the app
// }else {
//     DB = process.env.LOCAL_DB
// }

// mongoose.connect(DB, {  
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log('Database has been connected...');
// });