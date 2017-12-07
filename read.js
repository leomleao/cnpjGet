
const mongoose = require('mongoose');

const dotenv = require('dotenv');

const path = require('path');

const Cnpj = require('./models/Cnpj');

const CNPJValidator = require("cpf_cnpj").CNPJ;

const request = require('request');

const async = require('async'); 

const uuidv4 = require('uuid/v4');

const Excel = require('exceljs');





/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });

console.info("connected to MongoDB");

var validCnpjs = [];

var cnpjs = Cnpj.find({status: {$exists: true}}).cursor();

console.info("looking for data");

cnpjs.on('data', function(doc) {
  // Called once for every document
  // console.info(doc);
  validCnpjs.push(doc);
});

cnpjs.on('close', function(docs) {
  // Called once for every document
  	console.info('done');
  	console.info('creating spreadsheet now for');
  	console.info(validCnpjs.length);


  	let uuid = uuidv4();

  	var count = 0;


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
	    { header: 'atividade_principal_code', key: 'atividade_principal_code', width: 20 },
	    { header: 'atividade_principal_text', key: 'atividade_principal_text', width: 20 },
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
	    { header: 'capital_social', key: 'capital_social', width: 20 },
	    { header: 'qsa', key: 'qsa', width: 20 },
	    { header: 'atividades_secundarias', key: 'atividades_secundarias', width: 20 }
	];

		

	for (var i = validCnpjs.length - 1; i >= 0; i--) {
		
	
        try {
        	console.info("reading sec act");
        	var atividades_secundarias = '';
        	var qsa = '';

        	for (var k = validCnpjs[i].atividades_secundarias.length - 1; k >= 0; k--) {
        		atividades_secundarias = atividades_secundarias.concat(validCnpjs[i].atividades_secundarias[k].code, " - ", validCnpjs[i].atividades_secundarias[k].text, "\n");	        		
        	}

        	for (var j = validCnpjs[i].qsa.length - 1; j >= 0; j--) {
        		// qsa = qsa.concat(validCnpjs[i].qsa[j], " - ", validCnpjs[i].qsa[j], "\n");	        		
        	}
        	console.info("done reading");
        	console.info("adding row");

            worksheet.addRow({
				cnpj                     : validCnpjs[i].cnpjFormatted,  
				status                   : validCnpjs[i].status,
			    ultima_atualizacao       : validCnpjs[i].ultima_atualizacao,
			    tipo                     : validCnpjs[i].tipo,   
			    abertura                 : validCnpjs[i].abertura,  
			    nome                     : validCnpjs[i].nome,  
			    fantasia                 : validCnpjs[i].fantasia,
			    natureza_juridica        : validCnpjs[i].natureza_juridica,
			    atividade_principal_code : validCnpjs[i].atividade_principal[0].code,
			    atividade_principal_text : validCnpjs[i].atividade_principal[0].text,
			    logradouro               : validCnpjs[i].logradouro,
			    numero                   : validCnpjs[i].numero,
			    complemento              : validCnpjs[i].complemento,
			    cep                      : validCnpjs[i].cep,
			    bairro                   : validCnpjs[i].bairro,
			    municipio                : validCnpjs[i].municipio,
			    uf                       : validCnpjs[i].uf,
			    email                    : validCnpjs[i].email,
			    telefone                 : validCnpjs[i].telefone,
			    efr                      : validCnpjs[i].efr,
			    situacao                 : validCnpjs[i].situacao,
			    data_situacao            : validCnpjs[i].data_situacao,
			    motivo_situacao          : validCnpjs[i].motivo_situacao,
			    situacao_especial        : validCnpjs[i].situacao_especial,
			    data_situacao_especial   : validCnpjs[i].data_situacao_especial,
			    capital_social           : validCnpjs[i].capital_social,
			    // qsa                      : qsa,
			    qsa                      : JSON.stringify(validCnpjs[i].qsa),
			    atividades_secundarias   : atividades_secundarias       	


			});

			console.info("row added");
        } catch (e) {
        	console.error(e);
        }

	        console.info("processed", count)
	        count++;
	};
	    workbook.xlsx.writeFile(path.resolve(__dirname, './files/' + uuid + '.xlsx'))
	    .then(function() {
	    	console.info("File created with name:");
	    	console.info(uuid);
	    	console.info("It has", count, " lines added out  of ", validCnpjs.length, "cnpjs");
	    });
	

});