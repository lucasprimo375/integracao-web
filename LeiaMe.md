O Trabalho foi feito supondo:
	- o nome do banco é test (esse banco tem que ser acessível sem credenciais - basta usar o banco que já é criado com a instalação do mongo)
	- os documentos se chamam alunos, campi. curso

O servidor irá rodar na porta 3000
Para rodar o servidor, entrar na pasta back e rodar o comando node index.js.

O mongo roda na porta 27017

OBS:
Na rota "<server>/api/campi/:codigo" (método GET), o código do campi é o seu nome.

Na rota <server>/api/campi (método POST), o corpo da mensagem é {nome: <nome_do_campus>}

Na rota <server>/api/campi/:codigo (método PUT), o código é o nome do campus e o corpo da mensagem é o novo nome do campus.

A mesma lógica foi feita para as rotas restantes de /api/campi.