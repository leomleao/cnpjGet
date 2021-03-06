const uuidv4 = require('uuid/v4');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');
// const Cnpj = require('../models/Cnpj');
const fs = require('fs');
const path = require('path');
const CNPJValidator = require("cpf_cnpj").CNPJ;
const Excel = require('exceljs');
const request = require('request') // https://www.npmjs.com/package/request
    , async = require('async'); // https://www.npmjs.com/package/asyn

var wago = JSON.parse(fs.readFileSync('test.json', 'utf8'));

var Cnpj = require('../models/cnpj');

/**
 * GET /
 * upload page.
 */
exports.index = (req, res) => {
  res.render('pages/upload', {
    title: 'upload'
  });
};


var test = 0;
/**
 * GET /
 * upload page.
 */
exports.test = (req, res) => {

	test++;
	if (test == 5){
		test = 0
 		res.send(wago);
	} else {
 		res.send("Too many requests, please try again later.");		
	}
	console.info(test);
			
};


/**
 * GET /
 * file page.
 */
exports.file = (req, res) => {
 	let uuid = req.params.uuid; 	
 	var file = path.resolve(__dirname, '../files/' + uuid + '.xlsx')
    res.download(file); // Set disposition and send it.
};

/**
 * POST /
 * upload page.
 */
exports.uploadDB = (req, res) => {
	let fullUrl = req.protocol + '://' + req.get('host');
  if (!req.files)
		return res.status(400).send('No files were uploaded.');

	let uuid = uuidv4();

	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	let cnpjsFile = req.files.cnpjsFile;

	cnpjsList = decoder.write(req.files.cnpjsFile.data);
	cnpjsArray = cnpjsList.split("\n");

	var validCnpjs = [];
	var savedCnpjs = [];

	for (var i = cnpjsArray.length - 1; i >= 0; i--) {
		if (CNPJValidator.isValid(cnpjsArray[i])) {
			validCnpjs.push(cnpjsArray[i]);

			var company = new Cnpj({
			  uuid: uuid,
			  cnpj: CNPJValidator.strip(cnpjsArray[i])

			});

			company.save(function(err) {
			  if (err) throw err;
			  savedCnpjs.push(cnpjsArray[i]);

			  console.log("saved " + savedCnpjs.length + " out of " + cnpjsArray.length)


			  console.log('Cnpj saved successfully!', cnpjsArray[i]);
			});

		}		
	}  

	return res.status(200).send('Finished');  
		

	 // workbook.xlsx.writeFile(path.resolve(__dirname, '../files/' + uuid + '.xlsx'))
  //   .then(function() {
  //   	res.render('pages/upload', {
		//     title: 'Consulta Gerada',
		//     url: fullUrl + '/result/' + uuid
		// });	    	
  //   });

};



/**
 * POST /
 * upload page.
 */
exports.upload = (req, res) => {
	let fullUrl = req.protocol + '://' + req.get('host');
  if (!req.files)
		return res.status(400).send('No files were uploaded.');

	let uuid = uuidv4();

	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	let cnpjsFile = req.files.cnpjsFile;

	// Use the mv() method to place the file somewhere on your server
	let folderDest = path.resolve(__dirname, '../files/' + uuid );
	

	cnpjsList = decoder.write(req.files.cnpjsFile.data);
	cnpjsArray = cnpjsList.split("\n");

	var validCnpjs = [];
	var myUrls = [];

	for (var i = cnpjsArray.length - 1; i >= 0; i--) {
		if (CNPJValidator.isValid(cnpjsArray[i])) {
			validCnpjs.push(cnpjsArray[i]);
			myUrls.push('https://www.receitaws.com.br/v1/cnpj/' + CNPJValidator.strip(cnpjsArray[i]))
		}		
	}

	var workbook = new Excel.Workbook();
	workbook.creator = 'SuperLEO';

	var sheet = workbook.addWorksheet('CONSULTA CNPJ');
	var worksheet = workbook.getWorksheet('CONSULTA CNPJ');

	worksheet.columns = [
	    { header: 'cnpj', key: 'cnpj', width: 20 },   
	    { header: 'status', key: 'status', width: 20 },
	    { header: 'ultima_atualizacao', key: 'ultima_atualizacao', width: 20 },
	    { header: 'tipo', key: 'tipo', width: 20 },   
	    { header: 'abertura', key: 'abertura', width: 20 },  
	    { header: 'nome', key: 'nome', width: 20 },  
	    { header: 'fantasia', key: 'fantasia', width: 20 },
	    { header: 'natureza_juridica', key: 'natureza_juridica', width: 20 },
	    { header: 'logradouro', key: 'logradouro', width: 20 },
	    { header: 'numero', key: 'numero', width: 20 },
	    { header: 'complemento', key: 'complemento', width: 20 },
	    { header: 'cep', key: 'cep', width: 20 },
	    { header: 'bairro', key: 'bairro', width: 20 },
	    { header: 'municipio', key: 'municipio', width: 20 },
	    { header: 'uf', key: 'uf', width: 20 },
	    { header: 'email', key: 'email', width: 20 },
	    { header: 'telefone', key: 'telefone', width: 20 },
	    { header: 'efr', key: 'efr', width: 20 },
	    { header: 'situacao', key: 'situacao', width: 20 },
	    { header: 'data_situacao', key: 'data_situacao', width: 20 },
	    { header: 'motivo_situacao', key: 'motivo_situacao', width: 20 },
	    { header: 'situacao_especial', key: 'situacao_especial', width: 20 },
	    { header: 'data_situacao_especial', key: 'data_situacao_especial', width: 20 },
	    { header: 'capital_social', key: 'capital_social', width: 20 }
	];

	async.mapLimit(myUrls, 1,function(url, callback2) {
		var test22 = false;

		async.until(
		    function() { return test22; },
		    function(callback) {
		        var r = request(url, function(error, response, body) {
			    // Some processing is happening here before the callback is invoked
			    if (!error){
			    	console.info(response.body);  
			    	console.info(response.statusCode);
			    }
			    	if (!error && response.statusCode === 200 && body != "Too many requests, please try again later.") {	
						test22 = true;
				        callback(error, response, body);
			    	} else if (!error && response.statusCode === 504){			    		
						test22 = true;
			    		callback(error, null);

			    	} else {
			    		callback(error, null);
				      // some code   
			    	}
						    		    

			  })
		    },
		    function (err, response) {
		    	callback2(err, response); 		       
		    }
		);

		// async.whilst(
		//     function() { return test22; },
		//     function(error, callback) {  
		//  		// request
		// 	  //   	.get('http://localhost:5000/test') //url
		// 	  //   	.on('response', function(error, response, body) {
		// 	  //   		console.info(response);
		// 	  //   	 	test22 = body;
		// 	  //   	    callback(error, response); 
		// 	  // 		})
		// 	  request('http://localhost:5000/test', function(error, response, body) {

		// 	    // Some processing is happening here before the callback is invoked
		// 	    console.info(response.body);  
		// 	    console.info(error);
		// 	    console.info(response.statusCode);
		// 	    console.info(body);
		// 	    if (!error && response.statusCode === 200) {
		// 	    	if (body == "Too many requests, please try again later.") {
		// 	    		return false;
		// 	    	} else {
		// 	    		test22 = false;
		// 		        callback(error, response, body);
		// 	    	}
		// 		      // some code    
		// 		}		    		    

		// 	  })

		//  	},
		//     function (err, response) {
		//     	callback2(err, response);	  
		        
		//     }
		// )


		// async.retry({
		//   times: 10,
		//   interval: function(retryCount) {
		//     return 50 * Math.pow(2, retryCount);
		//   }
		// }, request(url, function(error, response, html) {   

	 // 	}), function(err, result) {
		// 	callback(error, result);
		//     // do something with the result
		// });

	  // request(url, function(error, response, html) {

	  //   // Some processing is happening here before the callback is invoked
	  //   // console.info(response.body);  
	  //   // console.info(error);
	  //   // console.info(response.statusCode);
	  //   	callback(error, response);	    

	  // });

	 //  	var count = 0;
		// async.whilst(
		//     function() { return count < 5; },
		//     function(callback) {
		//         count++;
		//         setTimeout(function() {
		//             callback(null, count);
		//         }, 1000);
		//     },
		//     function (err, n) {
		//         // 5 seconds have passed, n = 5
		//     }
		// );






	}, function(err, results) {

		try
	    {
	        for (var i = results.length - 1; i >= 0; i--) {
	        	if (results[i]){

					const regex = /\d{14}/g;
				    // console.info(currentCpnj[0]);
				    console.info(i);
				    try {	
				        let currentCpnj = regex.exec(results[i].socket._httpMessage.path);
			        	var resp = JSON.parse(results[i].body);
				    } catch (e) {
				        var resp = false;
				        console.info("deu ruim");
				        console.info(e);
				        console.info(results[i].body);

				    }
				    if (resp && resp.status == "OK"){
				    	console.info(resp.cnpj);
				    	worksheet.addRow({
				    		cnpj: resp.cnpj,  
				    		status: resp.status,
						    ultima_atualizacao: resp.ultima_atualizacao,
						    tipo: resp.tipo,   
						    abertura: resp.abertura,  
						    nome: resp.nome,  
						    fantasia: resp.fantasia,
						    natureza_juridica: resp.natureza_juridica,
						    logradouro: resp.logradouro,
						    numero: resp.numero,
						    complemento: resp.complemento,
						    cep: resp.cep,
						    bairro: resp.bairro,
						    municipio: resp.municipio,
						    uf: resp.uf,
						    email: resp.email,
						    telefone: resp.telefone,
						    efr: resp.efr,
						    situacao: resp.situacao,
						    data_situacao: resp.data_situacao,
						    motivo_situacao: resp.motivo_situacao,
						    situacao_especial: resp.situacao_especial,
						    data_situacao_especial: resp.data_situacao_especial,
						    capital_social: resp.capital_social	  
						});			   

				    } else {
				    	worksheet.addRow({
					    	cnpj: resp.currentCpnj,  
					    	status: resp.status
				    	});
				    }
				}
			}
	    }


	    catch( err ) {
	        // Return the error as JSON
	        res.render('pages/upload', {
			    title: 'Consulta Gerada',
			    error_number: 500,
			    error_desc: "erro interno"
			});	  
	    }

		

		 workbook.xlsx.writeFile(path.resolve(__dirname, '../files/' + uuid + '.xlsx'))
	    .then(function() {
	    	res.render('pages/upload', {
			    title: 'Consulta Gerada',
			    url: fullUrl + '/result/' + uuid
			});	    	
	    });
	  
	});	
	

	cnpjsFile.mv(folderDest, function(err) {
		if (err)

			{
				return res.status(500).send(err);
			}

	
	fs.unlinkSync(path.resolve(__dirname, '../files/' + uuid))
	});
};
