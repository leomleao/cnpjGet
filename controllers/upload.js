const uuidv4 = require('uuid/v4');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

/**
 * GET /
 * upload page.
 */
exports.index = (req, res) => {
  res.render('pages/upload', {
    title: 'upload'
  });
};



/**
 * POST /
 * upload page.
 */
exports.upload = (req, res) => {
  if (!req.files)
		return res.status(400).send('No files were uploaded.');

	let uuid = uuidv4();

	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	let cnpjsFile = req.files.cnpjsFile;

	// Use the mv() method to place the file somewhere on your server
	let folderDest = path.resolve(__dirname, 'files/' + uuid);
	

	cnpjsList = decoder.write(req.files.cnpjsFile.data);
	cnpjsArray = cnpjsList.split("\n");

	cnpjsFile.mv(folderDest, function(err) {

	if (err)

		return res.status(500).send(err);

	res.send('File uploaded! With code' + uuid);


	});
};
