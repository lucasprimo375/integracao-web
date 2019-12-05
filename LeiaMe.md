O Trabalho foi feito supondo:
	- o nome do banco é test (esse banco tem que ser acessível sem credenciais - basta usar o banco que já é criado com a instalação do mongo)
	- os documentos se chamam alunos, campi e curso

O servidor irá rodar na porta 3000
Para rodar o servidor, entrar na pasta back e rodar o comando node index.js.

O mongo roda na porta 27017

ROTAS QUE NÂO TEM INTERFACE GRÁFICA

Na rota /api/campi/:codigo (método get), o codigo é o nome do campus que se deseja buscar.

Na rota /api/campi (método post), os campos do body são nome (nome do campus) e cursos (um vetor de strings, onde cada string é o nome de um curso daquele campus).

Na rota /api/campi/:codigo (método put), codigo é o nome do campus e o body possui o campo nome, que é novo nome do campus.

Na rota /api/campi/:codigo (método delete), o codigo é o nome do campus a ser deletado.

Para entrar no site, abrir no navegador o arquivo index.html na pasta front.
