const express = require("express");
const router = express.Router();
const vehiclesController = require("../../controllers/vehiclesController");

router
  .route("/")
  .get(vehiclesController.getAllVehicles)
  .post(vehiclesController.createNewVehicle)
  .put(vehiclesController.updateVehicle)
  .delete(vehiclesController.updateVehicle);

router.route("/:id").get(vehiclesController.getVehicle);

module.exports = router;
