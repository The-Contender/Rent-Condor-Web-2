require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require("compression"); // Include compression
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
app.use(compression()); // Use compression

const mysql = require("mysql2");
const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect();

app.get("/", (req, res) => {
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
