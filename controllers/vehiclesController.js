const Vehicle = require("../model/Vehicle");

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
    return res
      .status(400)
      .json({
        message: "displayName, REF_ownerId and REF_poolId are required fields",
      });
  }

  try {
    const users = req.body.users || [];
    const pools = req.body.poosl || [];
    const result = await Vehicle.create({
      displayName: req.body.displayName,
      REF_ownerId: req.body.REF_ownerId,
      users: [{ REF_userId: req.body.REF_ownerId }, ...users],
      pools: [{ REF_poolId: req.body.REF_poolId }, ...pools],
      stats: req.body.stats,
      isPublic: req.body.isPublic,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const updateVehicle = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }

  const vehicle = await Vehicle.findOne({ _id: req.body.id }).exec();
  if (!vehicle) {
    return res
      .status(204)
      .json({ message: `No vehicle matches ID ${req.body.id}.` });
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
  if (!req?.body?.id)
    return res.status(400).json({ message: "Vehicle ID required." });

  const vehicle = await Vehicle.findOne({ _id: req.body.id }).exec();
  if (!vehicle) {
    return res
      .status(204)
      .json({ message: `No vehicle matches ID ${req.body.id}.` });
  }
  const result = await vehicle.deleteOne(); //{ _id: req.body.id }
  res.json(result);
};

const getVehicle = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Vehicle ID required." });

  const vehicle = await Vehicle.findOne({ _id: req.params.id }).exec();
  if (!vehicle) {
    return res
      .status(204)
      .json({ message: `No vehicle matches ID ${req.params.id}.` });
  }
  res.json(vehicle);
};

module.exports = {
  getAllVehicles,
  createNewVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicle,
};
