const express = require('express');
const fileUpload = require('express-fileupload');
const uuidv4 = require('uuid/v4');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');
const excel = require('node-excel-export');

const path = require('path');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(fileUpload());

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('pages/index'));

app.get('/upload', (req, res) => res.render('pages/upload'));

app.get('/result/:uuid', (req, res, req) => res.render('pages/upload'));




app.post('/upload', function(req, res) {
	if (!req.files)
		return res.status(400).send('No files were uploaded.');

	let uuid = uuidv4();

	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	let cnpjsFile = req.files.cnpjsFile;

	// Use the mv() method to place the file somewhere on your server
	let folderDest = path.resolve(__dirname, 'files/' + uuid);
	

	cnpjsList = decoder.write(req.files.cnpjsFile.data);
	cnpjsArray = cnpjsList.split("\n");
	console.debug(cnpjsArray);

	cnpjsFile.mv(folderDest, function(err) {

	if (err)

		return res.status(500).send(err);

	res.send('File uploaded! With code' + uuid);


	});
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
