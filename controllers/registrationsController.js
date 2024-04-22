const Registration = require("../model/Registration");

const getAllRegistrations = async (req, res) => {
  const registrations = await Registration.find();
  if (!registrations)
    return res.status(204).json({ message: "No registrations found." });
  res.json(registrations);
};

const createNewRegistration = async (req, res) => {
  if (!req?.body?.displayName || !req?.body?.REF_ownerId) {
    return res
      .status(400)
      .json({ message: "Display name and REF_ownerId are required" });
  }

  try {
    const users = req.body.users || [];
    const vehicles = req.body.vehicles || [];
    const result = await Registration.create({
      displayName: req.body.displayName,
      REF_ownerId: req.body.REF_ownerId,
      users: [{ REF_userId: req.body.REF_ownerId }, ...users],
      vehicles: [...vehicles],
      stats: req.body.stats,
      isPublic: req.body.isPublic,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const updateRegistration = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }

  const registration = await Registration.findOne({ _id: req.body.id }).exec();
  if (!registration) {
    return res
      .status(204)
      .json({ message: `No registration matches ID ${req.body.id}.` });
  }
  if (req.body?.displayName) registration.displayName = req.body.displayName;
  if (req.body?.REF_ownerId) registration.REF_ownerId = req.body.REF_ownerId;
  if (req.body?.users) registration.users = req.body.users;
  if (req.body?.vehicles) registration.vehicles = req.body.vehicles;
  if (req.body?.stats) registration.stats = req.body.stats;
  if (req.body?.isPublic) registration.isPublic = req.body.isPublic;
  const result = await registration.save();
  res.json(result);
};

const deleteRegistration = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "Registration ID required." });

  const registration = await Registration.findOne({ _id: req.body.id }).exec();
  if (!registration) {
    return res
      .status(204)
      .json({ message: `No registration matches ID ${req.body.id}.` });
  }
  const result = await registration.deleteOne(); //{ _id: req.body.id }
  res.json(result);
};

const getRegistration = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Registration ID required." });

  const registration = await Registration.findOne({
    _id: req.params.id,
  }).exec();
  if (!registration) {
    return res
      .status(204)
      .json({ message: `No registration matches ID ${req.params.id}.` });
  }
  res.json(registration);
};

module.exports = {
  getAllRegistrations,
  createNewRegistration,
  updateRegistration,
  deleteRegistration,
  getRegistration,
};
