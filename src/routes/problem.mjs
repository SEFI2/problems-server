// Internal imports
import problemController from "../controllers/problem.ctrl.mjs";
import validator from "../validator";

// Declare
const { validate } = validator;
const { fetchProblems, submit } = problemController;

// Init routes
export default router => {
  router.route("/fetchProblems").get(validate("getStats"), fetchProblems);
  router.route("/submit").post(validate("submit"), submit);
};
