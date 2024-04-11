const Vehicle = require("../model/Vehicle");

const getAllVehicles = async (req, res) => {
  const vehicles = await Vehicle.find();
  if (!vehicles) return res.status(204).json({ message: "No vehicles found." });
  res.json(vehicles);
};

const createNewVehicle = async (req, res) => {
  if (!req?.body?.displayName || !req?.body?.owner) {
    return res
      .status(400)
      .json({ message: "Display name and owner are required" });
  }

  try {
    const result = await Vehicle.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
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
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No vehicle matches ID ${req.body.id}.` });
  }
  if (req.body?.firstname) vehicle.firstname = req.body.firstname;
  if (req.body?.lastname) vehicle.lastname = req.body.lastname;
  const result = await vehicle.save();
  res.json(result);
};

const deleteVehicle = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "Employee ID required." });

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
