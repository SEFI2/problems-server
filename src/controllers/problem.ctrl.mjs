// Internal imports
import validator from "../validator";

import { db } from "../../app.mjs";

const { checkValidation } = validator;
const getAllProblems = () => {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT id, problem_text, type, choices, answer FROM problems",
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
};

export default {
  /**
   * fetchProblems
   *
   * @param  {Request} req
   * @param  {Response} res
   * @param  {Function} next
   */
  fetchProblems: async (req, res, next) => {
    try {
      // Check request
      checkValidation(req);

      // Define problems
      const problems = await getAllProblems();

      // Send data
      res.send({ problems });
    } catch (err) {
      console.log({ err });
      res.send(err);
    }
    next();
  },

  /**
   * submit
   *
   * @param  {Request} req
   * @param  {Response} res
   * @param  {Function} next
   */
  submit: async (req, res, next) => {
    try {
      // Check request
      checkValidation(req);

      // Destruct body
      const { input } = req.body;

      const answers = JSON.parse(input);

      // Define problems
      const problems = await getAllProblems();

      // Define results
      const results = answers
        .map(answer => {
          const problem = problems.find(p => {
            return p.id === answer.id;
          });

          if (!problem) {
            return null;
          }

          const result = {
            id: problem.id,
            result: problem.type === 3 || problem.answer === answer.answer,
            answer: problem.type === 3 ? answer.answer : problem.answer
          };
          return result;
        })
        .filter(entry => entry);

      // Insert results to db
      const statement = db.prepare(
        "INSERT INTO results(problem_id, result, answer) VALUES (?, ?, ?)"
      );
      results.forEach(entry => {
        const { id, result, answer } = entry;
        statement.run([id, result ? 1 : 0, answer], err => {
          if (err) {
            console.log({ err });
          }
        });
      });
      statement.finalize();

      // Send results
      res.send({ results });
    } catch (err) {
      console.log({ err });
      res.send(err);
    }

    next();
  }
};
