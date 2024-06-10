const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const Router = require("./Router.js");
const { connectToDatabase } = require("./database/db");

function main() {
  let app = express();
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json({ limit: "300mb" }));
  app.use(express.urlencoded({ extended: true, limit: "300mb" }));
  Router(app);
  connectToDatabase();
  app.listen(5010, () => console.log(`Server listening on port: 5010`));
}

main();
