const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

require("dotenv").config({ path: "../.env" });

const mysql = require("mysql2");
const connection = mysql.createConnection(process.env.DATABASE_URL);

const middlewares = require("./middlewares");
const api = require("./api");

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  //adding comments to force redeploy
  // Query to select the first 10 rows from 'properties' table
  connection.query("SELECT * FROM properties", (err, rows, fields) => {
    if (err) {
      // Proper error handling
      console.error("Error while fetching data: ", err);
      res.status(500).send("Error while fetching data");
      return;
    }
    // Send the rows as the response
    //console.log(rows); //update
    res.send(rows);
  });
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
