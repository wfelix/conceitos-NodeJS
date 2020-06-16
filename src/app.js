const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateRepositorieId (request, response,next) {
  const { id } = request.params;

  if ( !isUuid(id) ) {
    return response.status(400).json({error: 'Invalid project ID'});
  }

  return next();
}

app.use('/repositories/:id', validateRepositorieId);

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } =  request.body;

  const repositorie = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  
  repositories.push(repositorie)

  return response.status(201).json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } =  request.body;

  const repositorieIndex = repositories.findIndex( repositorie => repositorie.id === id );

  if ( repositorieIndex < 0 ) {
    return response.status(400).json({error: 'Repositorie not foud'});
  }

  const repositorieWrk = repositories[repositorieIndex];
  
  const repositorie = {
    id,
    title,
    url,
    techs,
    likes: ( repositorieWrk.likes ) ? repositorieWrk.likes : 0
  }   
  
  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex( repositorie => repositorie.id === id );

  if ( repositorieIndex < 0 ) {
    return response.status(400).json({error: 'Repositorie not foud'});
  }

  repositories.splice(repositorieIndex,1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const { likes } = request.body;

  const repositorieIndex = repositories.findIndex( repositorie => repositorie.id === id );

  if ( repositorieIndex < 0 ) {
    return response.status(400).json({error: 'Repositorie not foud'});
  }

  const repositorieWrk = repositories[repositorieIndex];
  
  const repositorie = {
    ...
    repositorieWrk,
    likes: (likes > 0) ? likes : repositorieWrk.likes ? ++repositorieWrk.likes : 1
  }
  
  repositories[repositorieIndex] = repositorie;

  return response.status(200).json(repositorie);
});

module.exports = app;
