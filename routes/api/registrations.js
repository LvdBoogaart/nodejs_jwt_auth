const express = require("express");
const router = express.Router();
const registrationsController = require("../../controllers/registrationsController");

router
  .route("/")
  .post(registrationsController.createNewRegistration)
  .put(registrationsController.updateRegistration)
  .put(registrationsController.deleteRegistration);

router.route("/:id").get(registrationsController.getRegistration);
router
  .route("/user/:REF_userId")
  .get(registrationsController.getAllUserRegistrations);
router
  .route("/pool/:REF_poolId")
  .get(registrationsController.getAllPoolRegistrations);
router
  .route("/vehicle/:REF_vehicleId")
  .get(registrationsController.getAllVehicleRegistrations);
router
  .route("/user/:REF_userId/pool/:REF_poolId")
  .get(registrationsController.getAllUPRegistrations);
router
  .route("/user/:REF_userId/vehicle/:REF_vehicleId")
  .get(registrationsController.getAllUVRegistrations);
router
  .route("/pool/:REF_poolId/vehicle/:REF_vehicleId")
  .get(registrationsController.getAllPVRegistrations);
router
  .route("/user/:REF_userId/pool/:REF_poolId/vehicle/:REF_vehicleId")
  .get(registrationsController.getAllUPVRegistrations);

module.exports = router;
