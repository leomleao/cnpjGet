const uuidv4 = require('uuid/v4');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');
const Cnpj = require('../models/Cnpj');
const fs = require('fs');
const path = require('path');
const CNPJ = require("cpf_cnpj").CNPJ;
const Excel = require('exceljs');
const request = require('request') // https://www.npmjs.com/package/request
    , async = require('async'); // https://www.npmjs.com/package/async


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
		if (CNPJ.isValid(cnpjsArray[i])) {
			validCnpjs.push(cnpjsArray[i]);
			myUrls.push('https://www.receitaws.com.br/v1/cnpj/' + CNPJ.strip(cnpjsArray[i]))
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

	async.map(myUrls, function(url, callback) {
	  request(url, function(error, response, html) {
	    // Some processing is happening here before the callback is invoked
	    // console.info(response.body);

	    const regex = /\d{14}/g;
	    let currentCpnj = regex.exec(url);
	    // console.info(currentCpnj[0]);
	    try {
        	 var resp = JSON.parse(response.body);
	    } catch (e) {
	         var resp = false;
	    }
	    if (resp && resp.status == "OK"){
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


	    callback(error, html);
	  });
	}, function(err, results) {
		 workbook.xlsx.writeFile(path.resolve(__dirname, '../files/' + uuid + '.xlsx'))
	    .then(function() {
	    	res.send('<a href="' + fullUrl + '/result/' + uuid + '">Planilha com sua consulta</a>' );
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
