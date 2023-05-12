require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectionInit = require("./db/init");
const {sequelize} = require("./db/sequelize");
const { createRole, createSuperUser } = require("./db/migrations");
const { ConfigRouter } = require("./utils/app");
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

ConfigRouter(app)

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`app listen [+] ${port}`);
  connectionInit().then((_) => 
      sequelize
          .sync({alter : false, force: false}))
          .then(_ => createRole())
          .then(_ => createSuperUser())
});
