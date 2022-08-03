const server = require("./src/app.js");
const { conn, Types } = require("./src/db.js");
const axios = require("axios");
const PORT = process.env.PORT || 3001

const precarga = async () => {
const tipoos = (await axios.get("https://pokeapi.co/api/v2/type")).data.results.map(e =>({name:e.name}))    
await Types.bulkCreate(tipoos);
};

// Syncing all the models at once.
conn.sync({ force: true }).then(async () => {
  server.listen(PORT, async () => {
    await precarga();
    console.log("%s listening at 3001"); // eslint-disable-line no-console
  });
});
