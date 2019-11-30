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
			console.log(res);
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