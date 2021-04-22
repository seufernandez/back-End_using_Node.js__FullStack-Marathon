
// VERBOS HTTP

// GET = BUSCA INFORMAÇÕES
// POST = CRIAR ALGO
// PUT = EDITAR/ ATULAIZAR ALGUMA INFO DO PROJETO
// DELETE = DELETAR A I


// Tipos de Parametros

// Query Params (req.query) : Filtragens e Paginações
// Route Params (req.params) : Atualizar ou Deletar um Recurso
// Request Body (req.body) : Formulários e outras informações

//MIDDLEWARES = Serão responsáveis por parar totalmente as requisições, validar informações ou registrar requisições

// Importando as Bibliotecas
const express = require('express');
const { uuid, isUuid }= require('uuidv4');

//Declarando e trazendo a função express
const app = express();

//MIDDLEWARES

//Registrando cada requisição da aplicação
function logRequest ( req, res, next ){
    const { method, url } = req;

    const logLabel = `[${method.toUpperCase()}] ${url}` //[GET] /projects

    console.time(logLabel)

    next()

    console.timeEnd(logLabel)

}

//Validando o ID de cada projeto, através dos parametros de rota (usando Uuid)
function validateProjectID  ( req, res, next ){
    const { id } = req.params;

    if (!isUuid(id)) {
        return res.status(400).json({ error: 'Invalid project ID!!!!!!!!!!'})
    }

    return next()
}

// Declarando a maneira que o Node executará as rotas e usará seus recursos
app.use(express.json());

//Chamando o Middleware para todas as requisições da aplicação
app.use(logRequest)



// Criando nosso mini Banco de dados
const projects = []



//LIST
app.get('/projects', (req, res) => {
    //Deixando filtro query disponível caso solicitado
    const { title } = req.query;

    //Filtragem
    const results = title
        ? projects.filter(project => project.title.includes(title))
        : projects

    return res.json(results)
})


//CREATION
app.post('/projects', (req, res) => {
    //Puxando Informações do Body para criação do projeto
    const { title, owner } = req.body

    //Criando o Projeto com as informações trazidas
    const project = { id: uuid() , title, owner}

    //Alocando o Projeto no Banco de dados
    projects.push(project)

    //Retornando nosso Projeto criado
    return res.json(project)
})


//EDITION
app.put('/projects/:id', validateProjectID, (req, res) => {
    //Trazendo as informações do Body e do Params
    const { title, owner } = req.body;
    const { id } = req.params

    //Achando a posição do nosso projeto no array Projects pelo id
    const projectIndex = projects.findIndex(project => project.id === id)

    //Validação se o Projeto foi encontrado
    if ( projectIndex < 0 ) {
        return res.status(400).json({ error: 'Sorry, Project not found'})      
    }
    //Formando nosso projeto com as informações atualizadas
    const project = {
        id,
        title,
        owner
    };

    //Substituindo nosso projeto antigo pelo novo, usando o Index
    projects[projectIndex] = project

    //Retornando nosso Projeto já atualizado
    return res.json(project)
})


//DELETE
app.delete('/projects/:id', validateProjectID, (req, res) => {
    //Trazendo as Informações do Params ( id )
    const { id } = req.params

    //Validação se o Projeto foi encontrado
    const projectIndex = projects.findIndex(project => project.id === id)

    if ( projectIndex < 0 ) {
        return res.status(400).json({ error: 'Sorry, Project not found'})      
    }

    //Excluindo nosso projeto do array usando a função splice e o Index
    projects.splice(projectIndex, 1)

    //Retornando vazio por ja ter sido excluido
    return res.json({deleted: 'Project deleted successfully'})
})


//Abrindo a Porta da aplicação
app.listen(4242, () => { 
    console.log('SERVER TA NAICE :) ')
});