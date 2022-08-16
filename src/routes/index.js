const { Router } = require("express");
const { Pokemon, Types, Pokemonb} = require("../db");
// Importar todos los routers;

const router = Router();

// Configurar los routers

const AllPoke = async () => {
try {
 const dbPoke = await Pokemon.findAll(
  {
  include: {
    model: Types,
    attributes: ["name"],
    through: { attributes: [],},
  },
}
);
 aux=[]
  dbPoke.forEach(e=>{
  aux.push ({
      id: e.id,
      name: e.name,
      hp: e.hp,
      attack: e.attack,
      defense: e.defense,
      speed: e.speed,
      height: e.height,
      weight: e.weight,
      sprite: e.sprite,
      created:e.created,
      types:e.types.map(e => e.name), }) 
  })

const dbPoke2 = await Pokemonb.findAll()

return [...aux, ...dbPoke2] 
} catch (error) {
console.log(error)
}
};
router.get("/pokemons", async (req, res) => {
  const { name } = req.query;
  try {
    const all = await AllPoke()
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
    const all = await AllPoke()
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

function* generateID(){let id =151;
  while(true){ yield id;id++}
}
const createpokeid=generateID()
router.post("/pokemons", async (req, res) => {
try {
  const {name,types,hp,attack,defense,speed,height,weight,sprite}= req.body

const nuevoPoke = await Pokemon.create({
    name,hp,attack,defense,speed,height,weight,sprite,
     id:createpokeid.next().value,
     created:true
})
const typedb = await Types.findAll({ where:{name:types} })
nuevoPoke.addTypes(typedb)

res.json({msg: "pokemon creado"})
} catch (error) {console.log(error)}
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
