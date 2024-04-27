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
router.route("/subscribe/:id").post(vehiclesController.subscribeToVehicle);
router
  .route("/unsubscribe/:id")
  .post(vehiclesController.unsubscribeFromVehicle);
router.route("/user/:id").get(vehiclesController.getAllUserSubscribedVehicles);

module.exports = router;
