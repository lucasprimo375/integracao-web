function clear_selects() {
	var selector_field = document.getElementById("curso");

	for( var i = selector_field.options.length - 1; i >= 0 ; i-- )
		selector_field.remove(i);

	var campi_field = document.getElementById("campus");

	for( var i = campi_field.options.length - 1; i >= 0 ; i-- )
		campi_field.remove(i);
}

function clear_curso_select(){
	var selector_field = document.getElementById("curso");

	for( var i = selector_field.options.length - 1; i >= 0 ; i-- )
		selector_field.remove(i);	
}

function get_campi(){
	axios
		.get("http://localhost:3000/api/campi")
		.then(res => {
			var campi = res.data;

			clear_selects();

			var campus_field = document.getElementById("campus");
			var curso_field = document.getElementById("curso");

			for(var i = 0; i < campi.length; i++){
				var campus_option = document.createElement("option");
				campus_option.value = campi[i].nome;
				campus_option.innerHTML = campi[i].nome;
				campus_field.appendChild(campus_option);
			}

			campus_field.onchange = function(){
				clear_curso_select();

				for(var i = 0; i < campi.length; i++){
					if(campus_field.value == campi[i].nome){
						for(var j = 0; j < campi[i].cursos.length; j++){
							var curso_option = document.createElement("option");
							curso_option.value = campi[i].cursos[j];
							curso_option.innerHTML = campi[i].cursos[j];
							curso_field.appendChild(curso_option);
						}
					}
				}
			}

			campus_field.onchange();
		})
		.catch(error => {
			console.log(error);
		});
}

function cadastrar_aluno(aluno){
	axios
		.post("http://localhost:3000/api/alunos", aluno)
		.then(res => {
			console.log("sucesso");
		})
		.catch(err => {
			console.log("erro");
		});
}

function alterar_aluno(aluno){
	axios
		.put("http://localhost:3000/api/alunos/" + aluno.matricula, aluno)
		.then(res => {
			console.log("sucesso");
		})
		.catch(err => {
			console.log(err.response.data);
		});
}

function todos_alunos(){
	axios
		.get("http://localhost:3000/api/alunos")
		.then(res => {
			var alunos_ = res.data;

			for(var i = 0; i < alunos_.length; i++){
				let aluno = alunos_[i];

				alunos.push(aluno);
				aluno.id = id;
				id++;

				let linha = document.createElement("tr")
				linha.id = aluno.matricula;

				var matricula_td = document.createElement("td");
				matricula_td.innerHTML = aluno.matricula;

				var nome_td = document.createElement("td");
				nome_td.innerHTML = aluno.nome;

				var botao_remover = document.createElement("input");
				botao_remover.type = "button"
				botao_remover.value = "Remover";
				let aluno_id = aluno.id;
				let mat = aluno.matricula;
				botao_remover.onclick = function() {
					for(var j = 0; j < alunos.length; j++) {
						if( alunos[j].id == aluno_id ) break;
					}

					alunos.splice(j, 1);
					console.log("");

					var tabela_alunos = document.getElementById("tabela_alunos");

					if(confirm("Confirma exclusão?!")){
						console.log(linha);
						tabela_alunos.removeChild(linha);

						axios
							.delete("http://localhost:3000/api/alunos/" + mat, aluno)
							.then(res => {
								console.log(res);
							})
							.catch(err => {
								console.log(err);
							});
					}
				}
				botao_remover.classList.add("botao_adicionar");

				var botao_alterar = document.createElement("input");
				botao_alterar.type = "button";
				botao_alterar.value = "Alterar";
				botao_alterar.onclick = function() {
					var aluno_ = aluno_por_matricula(mat);
					
					document.getElementById("matricula").value = aluno_.matricula;
					document.getElementById("matricula").readOnly = true;

					document.getElementById("nome").value = aluno_.nome;

					document.getElementById("data_nascimento").value = aluno_.data_nascimento;

					document.getElementById("email").value = aluno_.email;

					document.getElementById("ddd").value = aluno_.ddd;

					document.getElementById("telefone").value = aluno_.telefone;

					document.getElementById("operadora").value = aluno_.operadora;
					
					document.getElementById("campus").value = aluno_.campus;
					document.getElementById("campus").onchange();

					document.getElementById("curso").value = aluno_.curso;

					document.getElementById("botao_inserir").style.display = "none";
					document.getElementById("botao_alterar").style.display = "";
				}
				botao_alterar.classList.add("botao_alterar");

				linha.appendChild(matricula_td);
				linha.appendChild(nome_td);
				linha.appendChild(botao_remover);
				linha.appendChild(botao_alterar);

				var tabela_alunos = document.getElementById("tabela_alunos");
				tabela_alunos.appendChild(linha);

				if(tabela_alunos.children.length == 1) tabela_alunos.appendChild(linha);
				else {
					var k = 1;
					var length = tabela_alunos.children.length - 1;

					while(k < length && aluno.matricula < parseInt(tabela_alunos.children[k].id))
						k++;

					if(aluno.matricula < parseInt(tabela_alunos.children[k].id))
						tabela_alunos.insertBefore(linha, tabela_alunos.children[k].nextSibling);
					else
						tabela_alunos.insertBefore(linha, tabela_alunos.children[k]);
				}
			}
		})
		.catch(err => {
			console.log(err);
		});	
}