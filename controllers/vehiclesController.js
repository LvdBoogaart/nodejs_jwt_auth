const Vehicle = require("../model/Vehicle");
const Pool = require("../model/Pool");
const User = require("../model/User");

const getAllVehicles = async (req, res) => {
  const vehicles = await Vehicle.find();
  if (!vehicles) return res.status(204).json({ message: "No vehicles found." });
  res.json(vehicles);
};

const createNewVehicle = async (req, res) => {
  if (
    !req?.body?.displayName ||
    !req?.body?.REF_ownerId ||
    !req?.body?.REF_poolId
  ) {
    return res.status(400).json({
      message: "displayName, REF_ownerId and REF_poolId are required fields",
    });
  }

  try {
    const users = req.body.users || [];
    const pools = req.body.pools || [];
    const newVehicle = await Vehicle.create({
      displayName: req.body.displayName,
      REF_ownerId: req.body.REF_ownerId,
      users: [{ REF_userId: req.body.REF_ownerId }, ...users],
      pools: [{ REF_poolId: req.body.REF_poolId }, ...pools],
      stats: req.body.stats,
      isPublic: req.body.isPublic,
    });

    if (!newVehicle) {
      return res.status(500).json({ message: "Failed to create vehicle." });
    }

    // Update the owner's user document
    const updatedUser = await User.findByIdAndUpdate(
      req.body.REF_ownerId,
      { $push: { vehicles: { REF_vehicleId: newVehicle._id } } },
      { new: true, safe: true, upsert: false } // options
    );

    if (!updatedUser) {
      return res.status(204).json({
        message: `No owner matches provided owner ID ${req.body.REF_ownerId}.`,
      });
    }

    //update the parent pool document
    const updatedPool = await Pool.findByIdAndUpdate(
      req.body.REF_poolId,
      { $push: { vehicles: { REF_vehicleId: newVehicle._id } } },
      { new: true, safe: true, upsert: false }
    );

    if (!updatedPool) {
      return res.status(204).json({
        message: `No pool matches provided pool ID ${req.body.REF_poolId}.`,
      });
    }

    res.status(201).json(newVehicle);
  } catch (err) {
    console.error(err);
  }
};

const updateVehicle = async (req, res) => {
  if (!req?.body?.REF_vehicleId) {
    return res.status(400).json({ message: "ID parameter is required." });
  }

  const vehicle = await Vehicle.findOne({ _id: req.body.REF_vehicleId }).exec();
  if (!vehicle) {
    return res
      .status(204)
      .json({ message: `No vehicle matches ID ${req.body.REF_vehicleId}.` });
  }
  if (vehicle.REF_ownerId !== req.body.REF_userId) {
    return res
      .status(403)
      .json({ message: "Only the owner can update a vehicle." });
  }
  if (req.body?.displayName) vehicle.displayName = req.body.displayName;
  if (req.body?.REF_ownerId) vehicle.REF_ownerId = req.body.REF_ownerId;
  if (req.body?.users) vehicle.users = req.body.users;
  if (req.body?.stats) vehicle.stats = req.body.stats;
  if (req.body?.isPublic) vehicle.isPublic = req.body.isPublic;
  const result = await vehicle.save();
  res.json(result);
};

const deleteVehicle = async (req, res) => {
  if (!req?.body?.REF_vehicleId) {
    return res.status(400).json({ message: "Vehicle ID required." });
  }

  try {
    const vehicle = await Vehicle.findById(req.body.REF_vehicleId);
    if (!vehicle) {
      return res
        .status(204)
        .json({ message: `No vehicle matches ID ${req.body.REF_vehicleId}.` });
    }

    if (vehicle.REF_ownerId !== req.body.REF_userId) {
      return res
        .status(403)
        .json({ message: `Only the owner can delete a vehicle.` });
    }

    // Store owner ID before deleting the vehicle
    const ownerId = vehicle.REF_ownerId;
    const poolId = vehicle.REF_poolId;

    // Delete the vehicle
    const deleteResult = await vehicle.deleteOne();
    if (!deleteResult.deletedCount) {
      return res.status(500).json({ message: "Failed to delete the vehicle." });
    }

    // Remove the vehicle ID from the owner's list
    const updateUser = await User.findByIdAndUpdate(
      ownerId,
      { $pull: { vehicles: { REF_vehicleId: vehicle._id } } },
      { new: true } // Optional, to return the updated document
    );

    if (!updateUser) {
      return res
        .status(404)
        .json({ message: "Owner not found or update failed." });
    }

    // Remove the vehicle ID from the pool list
    const updatePool = await Pool.findByIdAndUpdate(
      poolId,
      { $pull: { vehicles: { REF_vehicleId: vehicle._id } } },
      { new: true } // Optional, to return the updated document
    );

    if (!updatePool) {
      return res
        .status(404)
        .json({ message: "Pool not found or update failed." });
    }

    // Confirm deletion
    res.json({
      message: "Vehicle deleted successfully.",
      vehicle: vehicle._id,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred during the operation." });
  }
};

const getVehicle = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Vehicle ID required." });

  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id }).exec();
    if (!vehicle) {
      return res
        .status(204)
        .json({ message: `No vehicle matches ID ${req.params.id}.` });
    }
    res.json(vehicle);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "INVALID ID" });
  }
};

const subscribeToVehicle = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "vehicle ID required." });
  if (!req?.body?.REF_userId)
    return restart.status(400).json({ message: "User ID required." });

  //update vehicle
  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    { $push: { users: { REF_userId: req.body.REF_userId } } },
    { new: true, safe: true, upsert: false }
  );

  if (!updatedVehicle) {
    return res
      .status(204)
      .json({ message: `No vehicle matches ID ${req.params.id}.` });
  }

  // Update the owner's user document
  const updatedUser = await User.findByIdAndUpdate(
    req.body.REF_userId,
    { $push: { vehicles: { REF_vehicleId: req.params.id } } },
    { new: true, safe: true, upsert: false } // options
  );

  if (!updatedUser) {
    return res
      .status(204)
      .json({ message: `No user matches ID ${req.body.REF_userId}.` });
  }

  res.json(updatedUser);
};

const unsubscribeFromVehicle = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Vehicle ID required." });
  if (!req?.body?.REF_userId)
    return restart.status(400).json({ message: "User ID required." });

  //update pool
  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    { $pull: { users: { REF_userId: req.body.REF_userId } } },
    { new: true, safe: true, upsert: false }
  );

  if (!updatedVehicle) {
    return res
      .status(204)
      .json({ message: `No Vehicle matches ID ${req.params.id}.` });
  }

  // Update the owner's user document
  const updatedUser = await User.findByIdAndUpdate(
    req.body.REF_userId,
    { $pull: { vehicles: { REF_vehicleId: req.params.id } } },
    { new: true, safe: true, upsert: false } // options
  );

  if (!updatedUser) {
    return res
      .status(204)
      .json({ message: `No user matches ID ${req.body.REF_userId}.` });
  }

  res.json(updatedUser);
};

const getAllUserSubscribedVehicles = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "user ID required." });

  const pools = await Vehicle.find({ REF_userId: req.params.id }).exec();
  if (!PerformanceObserverEntryList) {
    return res
      .status(204)
      .json({ message: `No vehicles found for user ${req.params.id}.` });
  }
  res.json(pools);
};

module.exports = {
  getAllVehicles,
  createNewVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicle,
  subscribeToVehicle,
  unsubscribeFromVehicle,
  getAllUserSubscribedVehicles,
};
