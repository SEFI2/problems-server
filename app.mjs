// External imports
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import sqlite from "sqlite3";
import data from "./src/database.json";

// Internal imports
import problemRoute from "./src/routes/problem.mjs";
const sqlite3Verbose = sqlite.verbose();
export const db = new sqlite3Verbose.Database(":memory:");

// Create problems
db.serialize(() => {
  db.run(
    "CREATE TABLE  problems (id INTEGER PRIMARY KEY AUTOINCREMENT, problem_text TEXT, type INT, choices TEXT, answer TEXT)"
  );
  db.run("CREATE TABLE  results (problem_id Int, answer TEXT, result INT)");

  const statement = db.prepare(
    "INSERT INTO problems(problem_text, type, choices, answer) VALUES (?, ?, ?, ?)"
  );
  data.forEach(entry => {
    const { problem_text: problemText, type, choices, answer } = entry;
    statement.run([problemText, type, choices, answer], err => {
      if (err) {
        console.log({ err });
      }
    });
  });
  statement.finalize();
});

// Initialize app
const app = express();
const router = express.Router();
dotenv.config();

// Setup routes
problemRoute(router);
app.use(cors({ origin: "*" }));

// Setup middlewares and router
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", router);

// Initialize port and start to listen to port
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server started at port: ${port}`);
});
