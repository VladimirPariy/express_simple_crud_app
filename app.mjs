import express from 'express';
import fs from 'fs';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express();
const jsonParser = express.json();

app.use(express.static(`${__dirname}/public/`));

const filePath = 'pets.json';

// get all pets
app.get('/api/pets', (req, res) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const pets = JSON.parse(content);
  res.send(pets);
});

//create new pets
app.post('/api/pets', jsonParser, (req, res) => {
  if (!req.body) return res.sendStatus(400);
  const {pet_name, birth, owner, sex, species} = req.body

  let data = fs.readFileSync(filePath, 'utf-8');
  let pets = JSON.parse(data);

  const id = Math.max.apply(Math, pets.map(o => o.id))

  let pet = {pet_name, owner, birth, sex, species, id: id + 1};

  pets.push(pet)
  data = JSON.stringify(pets, null, 2)
  fs.writeFileSync(filePath, data)
  res.send(pet)
})

//update pet
app.put('/api/pets', jsonParser, (req, res) => {
  let data = fs.readFileSync(filePath, "utf8");
  let pets = JSON.parse(data);

  const {new_pet_name, new_owner, new_birth, new_sex, new_species, id} = req.body
  let pet = pets.find(p => String(p.id) === id)
  pets = pets.filter(p => String(p.id) !== id)

  if (pet) {
    pet = {
      ...pet,
      pet_name: new_pet_name ? new_pet_name : pet.pet_name,
      owner: new_owner ? new_owner : pet.owner,
      birth: new_birth ? new_birth : pet.new_birth,
      sex: new_sex ? new_sex : pet.sex,
      species: new_species ? new_species : pet.species
    }

    pets.push(pet);
    data = JSON.stringify(pets);
    fs.writeFileSync(filePath, data);
    res.send(pet)
  } else {
    res.status(404).send(pet)
  }

})

//delete pet by id
app.delete('/api/pets/:id', (req, res) => {
  let data = fs.readFileSync(filePath, "utf8");
  let pets = JSON.parse(data);
  const id = req.params.id;

  pets = pets.filter(p => String(p.id) !== id)
  data = JSON.stringify(pets);

  fs.writeFileSync(filePath, data);
  res.send(pets)
})

app.listen(3000, function () {
  console.log("Сервер ожидает подключения...");
});
