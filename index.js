const express = require('express');

const server = express();

server.use(express.json());

//localhost:3000/teste

// Query params = ?teste=1
// Route params = /users/1
// Request body = dados/objeto

const projects = [];

server.use((req, res, next) =>{
	console.count("Número de requisições");
	next();
})

function checkProjectExists(req, res, next) {
	const { id } = req.params;
	const project = projects.find(p => p.id == id);

	if(!project){
		return res.status(400).json({ error: 'Project does not exists' })
	}

	return next();
}
//METODO GET para listar todos
server.get('/projects',(req, res)=>{
	return res.json(projects);
});

//METODO POST para criar
server.post('/projects', (req, res) =>{
	const { id, title, tasks = []} = req.body;
	projects.push({
		id, 
		title, 
		tasks
	});

	return res.json(projects);
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) =>{
	const { id } = req.params;
	const { title } = req.body;
	const project = projects.find(p => p.id == id);
	
	project.tasks.push(title);

	return res.json(projects);
});

//METODO PUT para atualizar
server.put('/projects/:id', checkProjectExists, (req, res) =>{
	const { id } = req.params;
	const { title, tasks } = req.body;

	const project = projects.find(p => p.id == id);
	project.title = title;
	project.tasks = tasks;

  return res.json(project);
});

//METODO DELETE
server.delete('/projects/:id', checkProjectExists, (req, res)=>{
	const { id } = req.params;
	const index = projects.findIndex(p => p.id == id);

	projects.splice(index,1);

	return res.send();
});

server.listen(3000); 