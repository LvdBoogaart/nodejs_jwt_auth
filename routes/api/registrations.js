const express = require("express");
const router = express.Router();
const registrationsController = require("../../controllers/registrationsController");

router
  .route("/")
  .get(registrationsController.getAllRegistrations)
  .post(registrationsController.createNewRegistration)
  .put(registrationsController.updateRegistration)
  .delete(registrationsController.updateRegistration);

router.route("/:id").get(registrationsController.getRegistration);

module.exports = router;
