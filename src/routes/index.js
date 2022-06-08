const { Router } = require("express");
const { Pokemon, Types } = require("../db");
const axios = require("axios");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

const getAllPokemonApi = async () => {
  try {
    const url = await axios("https://pokeapi.co/api/v2/pokemon");
    const url2 = await axios(url.data.next);
    const ApiResult = url.data.results.concat(url2.data.results);
    const callPokemon = ApiResult.map((e) => axios(e.url));
    const subConsulta = await Promise.all(callPokemon);
    const poke = subConsulta.map((e) => {
      return {
        id: e.data.id,
        name: e.data.name,
        hp: e.data.stats[0].base_stat,
        attack: e.data.stats[1].base_stat,
        defense: e.data.stats[2].base_stat,
        speed: e.data.stats[5].base_stat,
        height: e.data.height,
        weight: e.data.weight,
        sprite: e.data.sprites.other.home.front_default,
        shiny: e.data.sprites.other.home.front_shiny,
        types: e.data.types.map((e) => e.type.name + " "),
      };
    });
    return poke;
  } catch (error) {
    console.log(error);
  }
};

const getPokemonDb = async () => {
  const dbPoke = await Pokemon.findAll({
    include: {
      model: Types,
      attributes: ["name"],
      through: {
        attributes: [],
      },
    },
  });

   aux = []

  dbPoke.forEach(e=>{
    aux.push({
      id: e.id,
      name: e.name,
      hp: e.hp,
      attack: e.attack,
      defense: e.defense,
      speed: e.speed,
      height: e.height,
      weight: e.weight,
      sprite: e.sprite,
      types: e.types.map(e => e.name + " "),}) 
  })
  return aux;
};

const AllPoke = async () => {
  const apiPokemon = await getAllPokemonApi();
  const dbPokemon = await getPokemonDb();
  return apiPokemon.concat(dbPokemon);
};

router.get("/pokemons", async (req, res) => {
  const { name } = req.query;
  try {
    const all = await AllPoke();
    if (name) {
      const FiltroName = all.filter((e) =>
        e.name.toString().toLowerCase().includes(name.toString().toLowerCase())
      );
      FiltroName
        ? res.status(200).json(FiltroName)
        : res.status(400).json({ msg: "no se encontro nada" });
    }
    res.status(200).json(all);
  } catch (error) {
    console.log(error);
  }
});

router.get("/pokemons/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const all = await AllPoke();
    const FiltroId = all.find((e) =>
      e.id.toString().toLowerCase()===id.toString().toLowerCase()
    );
    FiltroId
      ? res.status(200).json(FiltroId)
      : res.status(400).json({ msg: "no se encontro nada" });
  } catch (error) {
    console.log(error);
  }
});

router.post("/pokemons", async (req, res) => {

const {name,hp,attack,defense,speed,height,weight,sprite,types}= req.body
const nuevoPoke = await Pokemon.create({
    name,hp,attack,defense,speed,height,weight,sprite
})
 
const typedb = await Types.findAll({ where:{name:types} })
nuevoPoke.addTypes(typedb)
res.json({msg: "pokemon creado"})
});

router.get("/types", async (req, res) => {
Types.findAll()
.then(resp =>res.send(resp))
.catch(e=>console.log(e))
});


router.put("/pokemons/:id", async(req, res) => {
try {
 const {id} = req.params
const infodb = await Pokemon.findOne({where: {id: id}})
await infodb.update({
  name: req.body.name,
  hp: req.body.hp,
  attack: req.body.attack,
  defense: req.body.defense,
  speed: req.body.speed,
  height: req.body.height,
  weight: req.body.weight,
  sprite: req.body.sprite,
  types: req.body.types
})
res.send(infodb);
} catch (error) {
  console.log(error);
}
})

router.delete("/pokemons/:id", async(req, res) => {
      try {
        const { id } = req.params;
        const pokemonToDelete = await Pokemon.findByPk(id);
        if (pokemonToDelete) {
          await pokemonToDelete.destroy();
          return res.send("Pokemon Borrado");
        }
        res.status(404).send("Pokemon no encontrado");
      } catch (error) {
        res.status(400).send(error);
      }
  }
)



module.exports = router;
