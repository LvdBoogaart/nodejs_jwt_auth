const express = require("express");
const router = express.Router();
const vehiclesController = require("../../controllers/vehiclesController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(vehiclesController.getAllEmployees)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    vehiclesController.createNewEmployee
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    vehiclesController.updateEmployee
  )
  .delete(verifyRoles(ROLES_LIST.Admin), vehiclesController.deleteEmployee);

router.route("/:id").get(vehiclesController.getEmployee);

module.exports = router;
