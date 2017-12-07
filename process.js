
const mongoose = require('mongoose');

const dotenv = require('dotenv');

const path = require('path');

const Cnpj = require('./models/Cnpj');

const CNPJValidator = require("cpf_cnpj").CNPJ;

const request = require('request');

const async = require('async'); 




/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });

var validCnpjs = [];

var cnpjs = Cnpj.find({status: null}).cursor();

cnpjs.on('data', function(doc) {
  // Called once for every document
  // console.info(doc);
  validCnpjs.push(doc.cnpj);
});

cnpjs.on('close', function(doc) {
  // Called once for every document
  console.info('done');
  var myUrls = [];
	for (var i = validCnpjs.length - 1; i >= 0; i--) {
		console.info(validCnpjs[i]);
		
		myUrls.push('http://www.receitaws.com.br/v1/cnpj/' + CNPJValidator.strip(validCnpjs[i]))
				
	}

	console.info("about to process");
	console.info(myUrls.length);


	async.mapLimit(myUrls, 1,function(url, callback2) {
		var test22 = false;

	console.info(url);

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

			    	} else if (!error && response.statusCode === 503){			    		
						test22 = true;
			    		callback(error, null);

			    	} else {
			    		callback(error, null);
				      // some code   
			    	}
						    		    

			  })
		    },
		    function (err, response) {
		    	
		    	try
			    {
			       
		        	if (response != null){

						const regex = /\d{14}/g;
						console.info("processing:");

						console.info(response.body.cnpj);

					    try {	
					        let currentCpnj = regex.exec(response.socket._httpMessage.path);
				        	var resp = JSON.parse(response.body);
					    } catch (e) {
					        var resp = false;
					        console.info("deu ruim");
					        console.info(e);
					        console.info(response.body);

					    }
					    if (resp && resp.status == "OK"){			    	


					    	Cnpj.findOne({ cnpj: CNPJValidator.strip(resp.cnpj)}, function (err, doc){
								doc.cnpjFormatted          = resp.cnpj;
								doc.status                 = resp.status;
								doc.ultima_atualizacao     = resp.ultima_atualizacao;
								doc.tipo                   = resp.tipo;
								doc.abertura               = resp.abertura;
								doc.nome                   = resp.nome;
								doc.fantasia               = resp.fantasia;
								doc.atividade_principal    = resp.atividade_principal;
								doc.natureza_juridica      = resp.natureza_juridica;
								doc.logradouro             = resp.logradouro;
								doc.numero                 = resp.numero;
								doc.complemento            = resp.complemento;
								doc.cep                    = resp.cep;
								doc.bairro                 = resp.bairro;
								doc.municipio              = resp.municipio;
								doc.uf                     = resp.uf;
								doc.email                  = resp.email;
								doc.telefone               = resp.telefone;
								doc.efr                    = resp.efr;
								doc.situacao               = resp.situacao;
								doc.data_situacao          = resp.data_situacao;
								doc.motivo_situacao        = resp.motivo_situacao;
								doc.situacao_especial      = resp.situacao_especial;
								doc.data_situacao_especial = resp.data_situacao_especial;
								doc.capital_social         = resp.capital_social;
								doc.qsa                    = resp.qsa;
								doc.atividades_secundarias = resp.atividades_secundarias;

								// doc.visits.$inc();
	  							doc.save(function (err) {
								  if (err) 
								  {
								  	console.error("deu muito ruim");
								  	console.error(err);
								  }
								  	console.error("deu bom");
								  // saved!
								});
					        


					    	});		    			   

						    
						}
					}
			    }
			    catch( err ) {
			        // Return the error as JSON
			        console.error(err);

			    } 	
			    callback2(err, response); 	 
			         
		    }
		);


	}, function(err, results) {


		var CNPJSSSS = [];
		try
	    {	

	        for (var i = results.length - 1; i >= 0; i--) {
	        	if (results[i]){
	        		CNPJSSSS.push(results[i]);  
				}
			}

			console.info(CNPJSSSS.length);
	    }
	    catch( err ) {
	        // Return the error as JSON
	        console.error(err); 
	    }
	});

});

