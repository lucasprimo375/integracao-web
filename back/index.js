var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var mongo_client = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017";

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get("/api/alunos", function(req, res){
	mongo_client.connect(url, function(err, client) {
		if(err){
			res.statusCode = 404;
			res.end("Could not connect to server");
		} else {
			const db = client.db("test");
			const alunos = db.collection("alunos");

			if(!db || !alunos){
				res.statusCode = 404;
				res.end("Could not connect to database or to documents");
			} else {
				alunos.find({}).toArray(function(err, docs) {		  	
				    if(err){
				    	res.statusCode = 404;
						res.end("Could not find documents");	
				    } else {
				    	res.statusCode = 200;
				    	res.end(JSON.stringify(docs));
				    }

				    client.close();
			  	});
			}
		}
	});
});

app.get("/api/alunos/:matricula", function(req, res){
	mongo_client.connect(url, function(err, client) {
		if(err){
			res.statusCode = 404;
			res.end("Could not connect to server");
		} else {
			const db = client.db("test");
			const alunos = db.collection("alunos");

			if(!db || !alunos){
				res.statusCode = 404;
				res.end("Could not connect to database or to documents");
			} else {
				alunos.find({matricula: parseInt(req.params.matricula)}).toArray(function(err, docs) {		  	
				    if(err){
				    	res.statusCode = 404;
						res.end("Could not find documents");	
				    } else {
				    	if(docs.length == 0) {
				    		res.statusCode = 404;
				    		res.end("Não há alunos com essa matrícula");
				    	} else {
				    		res.statusCode = 200;
				    		res.end(JSON.stringify(docs));
				    	}
				    }

				    client.close();
			  	});
			}
		}
	});
});

app.post("/api/alunos", function(req, res){
	mongo_client.connect(url, function(err, client) {
		if(err){
			res.statusCode = 404;
			res.end("Could not connect to server");
		} else {
			const db = client.db("test");
			const alunos = db.collection("alunos");

			if(!db || !alunos){
				res.statusCode = 404;
				res.end("Could not connect to database or to documents");
			} else {
				alunos.insertOne({
					matricula: req.body.matricula, 
					nome: req.body.nome, 
					curso: req.body.curso,
					data_nascimento: req.body.data_nascimento,
					ddd: req.body.ddd,
					telefone: req.body.telefone,
					operadora: req.body.operadora,
					campus: req.body.campus,
					curso: req.body.curso,
					email: req.body.email
					}, 
					function(err, docs) {		  	
					    if(err){
					    	res.statusCode = 404;
							res.end("Could not find documents");	
					    } else {
				    		res.statusCode = 200;
				    		res.end(JSON.stringify(docs.ops[0]));
					    }

					    client.close();
			  	});
			}
		}
	});
});

app.put("/api/alunos/:matricula", function(req, res){
	mongo_client.connect(url, function(err, client) {
		if(err){
			res.statusCode = 404;
			res.end("Could not connect to server");
		} else {
			const db = client.db("test");
			const alunos = db.collection("alunos");

			if(!db || !alunos){
				res.statusCode = 404;
				res.end("Could not connect to database or to documents");
			} else {
				const update = {
					nome: req.body.nome, 
					curso: req.body.curso,
					data_nascimento: req.body.data_nascimento,
					ddd: parseInt(req.body.ddd),
					telefone: req.body.telefone,
					operadora: req.body.operadora,
					campus: req.body.campus,
					curso: req.body.curso,
					email: req.body.email
				};
				
				alunos.updateOne({matricula: parseInt(req.params.matricula)}, { $set: update}, function(err, docs) {		  	
				    if(err){
				    	res.statusCode = 404;
						res.end("Could not find documents");	
				    } else {
				    	if(docs.modifiedCount == 0){
				    		res.statusCode = 404;
				    		res.end("Nenhum aluno foi modificado");
				    	} else {
				    		res.statusCode = 200;
			    			res.end(JSON.stringify(update));
				    	}
				    }

				    client.close();
			  	});
			}
		}
	});
});

app.delete("/api/alunos/:matricula", function(req, res){
	mongo_client.connect(url, function(err, client) {
		if(err){
			res.statusCode = 404;
			res.end("Could not connect to server");
		} else {
			const db = client.db("test");
			const alunos = db.collection("alunos");

			if(!db || !alunos){
				res.statusCode = 404;
				res.end("Could not connect to database or to documents");
			} else {
				const update = {
					nome: req.body.nome, 
					curso: req.body.curso,
					data_nascimento: req.body.data_nascimento,
					ddd: parseInt(req.body.ddd),
					telefone: req.body.telefone,
					operadora: req.body.operadora,
					campus: req.body.campus,
					curso: req.body.curso,
					email: req.body.email
				};

				alunos.deleteOne({matricula: parseInt(req.params.matricula)}, function(err, docs) {		  	
				    if(err){
				    	res.statusCode = 404;
						res.end("Could not find documents");	
				    } else {
				    	if(docs.deletedCount == 0){
				    		res.statusCode = 404;
				    		res.end("Nenhum aluno foi deletado");
				    	} else {
				    		res.statusCode = 200;
			    			res.end(JSON.stringify(update));
				    	}
				    }

				    client.close();
			  	});
			}
		}
	});
});

function campus_existe(campi, nome){
	for(var i = 0; i < campi.length; i++){
		if(campi[i].nome == nome) return true;
	}

	return false;
}

function contabilizar_curso(campi, curso){
	for(var i = 0; i < campi.length; i++){
		if(campi[i].nome == curso.campus){
			campi[i].cursos.push(curso.nome);
		}
	}
}

function formatar_campi(cursos, callback){
	var campi = [];

	for(var i = 0; i < cursos.length; i++){
		if(!campus_existe(campi, cursos[i].campus)){
			campi.push({
				nome: cursos[i].campus,
				cursos: [cursos[i].nome]
			})
		} else {
			contabilizar_curso(campi, cursos[i]);
		}
	}

	callback(campi);
}

app.get("/api/campi", function(req, res){
	mongo_client.connect(url, function(err, client) {
		if(err){
			res.statusCode = 404;
			res.end("Could not connect to server");
		} else {
			const db = client.db("test");
			const cursos = db.collection("curso");

			if(!db || !cursos){
				res.statusCode = 404;
				res.end("Could not connect to database or to documents");
			} else {
				cursos.find({}).toArray(function(err, docs) {		  	
				    if(err){
				    	res.statusCode = 404;
						res.end("Could not find documents");	
				    } else {
				    	formatar_campi(docs, function(campi){
				    		res.statusCode = 200;
				    		res.end(JSON.stringify(campi));
				    		client.close();
				    	});
				    }
			  	});
			}
		}
	});
});

app.get("/api/campi/:codigo", function(req, res){
	mongo_client.connect(url, function(err, client) {
		if(err){
			res.statusCode = 404;
			res.end("Could not connect to server");
		} else {
			const db = client.db("test");
			const campi = db.collection("campi");

			if(!db || !campi){
				res.statusCode = 404;
				res.end("Could not connect to database or to documents");
			} else {
				campi.find({nome: req.params.codigo}).toArray(function(err, docs) {		  	
				    if(err){
				    	res.statusCode = 404;
						res.end("Could not find documents");	
				    } else {
				    	if(docs.length == 0) {
				    		res.statusCode = 404;
				    		res.end("Não há campi com esse codigo");
				    	} else {
				    		res.statusCode = 200;
				    		res.end(JSON.stringify(docs));
				    	}
				    }

				    client.close();
			  	});
			}
		}
	});
});

function deletar_alunos(cursos, alunos, callback){
	for(let i = 0; i < cursos.length; i++){
		alunos.deleteMany({curso: cursos[i].nome}, function(e, d){});
	}

	callback();
}

function deletar_cursos(curso, campi){
	curso.deleteMany({campus: campi}, function(e, d){
		console.log(e);
		console.log(d);
	});
}

app.delete("/api/campi/:codigo", function(req, res){
	mongo_client.connect(url, function(err, client) {
		if(err){
			res.statusCode = 404;
			res.end("Could not connect to server");
		} else {
			const db = client.db("test");
			const campi = db.collection("campi");

			if(!db || !campi){
				res.statusCode = 404;
				res.end("Could not connect to database or to documents");
			} else {
				campi.deleteOne({nome: req.params.codigo}, function(err, docs) {		  	
				    if(err){
				    	res.statusCode = 404;
						res.end("Could not find documents");	
				    } else {
				    	if(docs.deletedCount == 0){
				    		res.statusCode = 404;
				    		res.end("Nenhum campus foi deletado");
				    	} else {
				    		res.statusCode = 200;

				    		const curso = db.collection("curso");
				    		let alunos = db.collection("alunos")
				    		curso.find({campus: req.params.codigo}).toArray(function(err, doc){
				    			deletar_alunos(doc, alunos, function(){
				    				deletar_cursos(curso, req.params.codigo);
				    			});
				    		});

			    			res.end(JSON.stringify(docs));
				    	}
				    }

				    
			  	});
			}
		}
	});
});

app.put("/api/campi/:codigo", function(req, res){
	mongo_client.connect(url, function(err, client) {
		if(err){
			res.statusCode = 404;
			res.end("Could not connect to server");
		} else {
			const db = client.db("test");
			const campi = db.collection("campi");

			if(!db || !campi){
				res.statusCode = 404;
				res.end("Could not connect to database or to documents");
			} else {
				const update = {
					nome: req.body.nome
				};
				
				campi.updateOne({nome: req.params.codigo}, { $set: update}, function(err, docs) {		  	
				    if(err){
				    	res.statusCode = 404;
						res.end("Could not find documents");	
				    } else {
				    	if(docs.modifiedCount == 0){
				    		res.statusCode = 404;
				    		res.end("Nenhum campi foi modificado");
				    	} else {
				    		res.statusCode = 200;

				    		const curso = db.collection("curso");
				    		curso.updateMany({campus: req.params.codigo}, {$set: {campus: req.body.nome}}, function(err, docs){
				    			res.end(JSON.stringify(update));
				    		});
				    	}
				    }

				    client.close();
			  	});
			}
		}
	});
});

app.post("/api/campi", function(req, res){
	mongo_client.connect(url, function(err, client) {
		if(err){
			res.statusCode = 404;
			res.end("Could not connect to server");
		} else {
			const db = client.db("test");
			const campi = db.collection("campi");

			if(!db || !campi){
				res.statusCode = 404;
				res.end("Could not connect to database or to documents");
			} else {
				campi.insertOne({ nome: req.body.nome}, function(err, docs) {		  	
				    if(err){
				    	res.statusCode = 404;
						res.end("Could not find documents");	
				    } else {
			    		res.statusCode = 200;
			    		res.end(JSON.stringify(docs.ops[0]));
				    }

				    client.close();
			  	});
			}
		}
	});
});

app.listen(3000, function(){
	console.log("app rodando na porta 3000");
});