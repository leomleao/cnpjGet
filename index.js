const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');

const path = require('path');
const PORT = process.env.PORT || 5000;

const cnpjController = require('./controllers/cnpj');
const homeController = require('./controllers/home');
const uploadController = require('./controllers/upload');



const app = express();


/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});




app.set('views', path.join(__dirname, 'views'));




app.use(fileUpload());

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.get('/', homeController.index);

app.get('/upload', cnpjController.index);

app.get('/result/:uuid', uploadController.index);

app.post('/upload', uploadController.upload );



app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
