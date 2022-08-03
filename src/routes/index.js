const { Router } = require("express");
const { Pokemon, Types } = require("../db");
const axios = require("axios");
// Importar todos los routers;

const router = Router();

// Configurar los routers

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
  try {
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
  } catch (error) {
    console.log(error)
  }

};

const AllPoke = async () => {
try {
   let allinfo = Promise.all([getPokemonDb(),getAllPokemonApi()]).then(
    (res) => {
     return [...res[0], ...res[1]];
    }
  );
 return allinfo
} catch (error) {
console.log(error)
}
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
try {
  const {name,types,hp,attack,defense,speed,height,weight,sprite}= req.body
const nuevoPoke = await Pokemon.create({
    name,hp,attack,defense,speed,height,weight,sprite
})
 console.log(types)
const typedb = await Types.findAll({ where:{name:types} })
nuevoPoke.addTypes(typedb)
res.json({msg: "pokemon creado"})
} catch (error) {
  console.log(error)
}
});

router.get("/types", async (req, res) => {
Types.findAll()
.then(resp =>res.send(resp))
.catch(e=>console.log(e))
});




























































router.post("/pokemon2", async (req, res,next)=>{

  try {
    const{name,hp,defense,attack, height,sprite, speed,weight}=req.body

const newPoke= await Pokemon.create({name,hp,defense,attack, height,sprite, speed,weight})



res.json(newPoke)
  } catch (error) {
    console.log(error)
  }





})










module.exports = router;
