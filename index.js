const server = require("./src/app.js");
const { conn, Types, Pokemonb } = require("./src/db.js");
const axios = require("axios");
const PORT = process.env.PORT || 3001

const precarga = async () => {
const tipoos = (await axios.get("https://pokeapi.co/api/v2/type")).data.results.map(e =>({name:e.name}))   
await Types.bulkCreate(tipoos);
};
const getAllPokemonApi = async () => {
  try {
    const url = await axios("https://pokeapi.co/api/v2/pokemon?offset=0&limit=75");
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
        types: e.data.types.map((e) => e.type.name),
        created:false
      };
    });
  await Pokemonb.bulkCreate(poke)
    return poke;
  } catch (error) {
    console.log(error);
  }
};


// Syncing all the models at once.
conn.sync({ force: false }).then(async () => {
  server.listen(PORT, async () => {
    await precarga();
    await getAllPokemonApi();
    console.log("%s listening a t 3001"); // eslint-disable-line no-console
  });
});
