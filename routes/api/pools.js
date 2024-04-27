const express = require("express");
const router = express.Router();
const poolsController = require("../../controllers/poolsController");

router
  .route("/")
  .get(poolsController.getAllPools)
  .post(poolsController.createNewPool)
  .put(poolsController.updatePool)
  .delete(poolsController.updatePool);

router.route("/:id").get(poolsController.getPool);
router.route("/subscribe/:id").post(poolsController.subscribeToPool);
router.route("/unsubscribe/:id").post(poolsController.unsubscribeFromPool);
router.route("/user/:id").get(poolsController.getAllUserSubscribedPools);

module.exports = router;
