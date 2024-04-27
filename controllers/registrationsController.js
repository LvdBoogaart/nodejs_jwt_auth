const Registration = require("../model/Registration");

const createNewRegistration = async (req, res) => {
  const {
    REF_userId,
    REF_vehicleId,
    REF_poolId,
    registrationType,
    amount,
    isBusiness,
    isDeleted,
  } = req.body;

  // Define required fields
  const requiredFields = [
    { key: "REF_userId", value: REF_userId },
    { key: "REF_vehicleId", value: REF_vehicleId },
    { key: "REF_poolId", value: REF_poolId },
    { key: "registrationType", value: registrationType },
    { key: "amount", value: amount },
    { key: "isBusiness", value: isBusiness },
    { key: "isDeleted", value: isDeleted },
  ];

  // Collect names of missing fields
  const missingFields = requiredFields
    .filter((field) => field.value === undefined || field.value === null)
    .map((field) => field.key);

  // Return error message if any fields are missing
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  try {
    // Create a new registration document
    const newRegistration = new Registration({
      REF_userId,
      REF_vehicleId,
      REF_poolId,
      registrationType,
      amount,
      isBusiness,
      isDeleted,
    });

    // Save the registration to the database
    const result = await newRegistration.save();

    // Send the created registration back to the client
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create registration" });
  }
};

const updateRegistration = async (req, res) => {
  const { registrationId, registrationType, amount, isBusiness } = req.body;

  if (!registrationId) {
    return res.status(400).json({ message: "Registration ID is required" });
  }

  try {
    // Find the registration and update it
    const updatedRegistration = await Registration.findByIdAndUpdate(
      registrationId,
      { registrationType, amount, isBusiness },
      { new: true, runValidators: true } // return the updated document and run schema validators
    );

    if (!updatedRegistration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.status(200).json(updatedRegistration);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update registration" });
  }
};

const deleteRegistration = async (req, res) => {
  const { registrationId } = req.body;

  if (!registrationId) {
    return res.status(400).json({ message: "Registration ID is required" });
  }

  try {
    // Find the registration and toggle the isDeleted status
    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    // Toggle isDeleted status
    registration.isDeleted = !registration.isDeleted;

    // Save the updated registration
    const updatedRegistration = await registration.save();

    res.status(200).json(updatedRegistration);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to toggle deletion status of registration" });
  }
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
  res.status(200).json(registration);
};

const getAllUserRegistrations = async (req, res) => {
  if (!req?.params?.REF_userId)
    return res.status(400).json({ message: "User ID required" });

  const registrations = await Registration.find({
    REF_userId: req.params.REF_userId,
  });

  if (registrations.length === 0) {
    return res.status(404).jswon({ message: "No registrations found" });
  }

  res.status(200).json(registrations);
};

const getAllPoolRegistrations = async (req, res) => {
  if (!req?.params?.REF_poolId)
    return res.status(400).json({ message: "Pool ID required" });

  const registrations = await Registration.find({
    REF_poolId: req.params.REF_poolId,
  });

  if (registrations.length === 0) {
    return res.status(404).jswon({ message: "No registrations found" });
  }

  res.status(200).json(registrations);
};

const getAllVehicleRegistrations = async (req, res) => {
  if (!req?.params?.REF_vehicleId)
    return res.status(400).json({ message: "Vehicle ID required" });

  const registrations = await Registration.find({
    REF_vehicleId: req.params.REF_vehicleId,
  });

  if (registrations.length === 0) {
    return res.status(404).jswon({ message: "No registrations found" });
  }

  res.status(200).json(registrations);
};

const getAllUPRegistrations = async (req, res) => {
  if (!req?.params?.REF_userId || !req?.params?.REF_poolId)
    return res.status(400).json({ message: "User ID and Pool ID required" });

  const query = {
    REF_userId: req.params.REF_userId,
    REF_poolId: req.params.REF_poolId,
  };

  const registrations = await Registration.find(query);

  if (registrations.length === 0) {
    return res.status(404).jswon({ message: "No registrations found" });
  }

  res.status(200).json(registrations);
};

const getAllUVRegistrations = async (req, res) => {
  if (!req?.params?.REF_userId || !req?.params?.REF_vehicleId)
    return res.status(400).json({ message: "User ID and Vehicle ID required" });

  const query = {
    REF_userId: req.params.REF_userId,
    REF_vehicleId: req.params.REF_vehicleId,
  };

  const registrations = await Registration.find(query);

  if (registrations.length === 0) {
    return res.status(404).jswon({ message: "No registrations found" });
  }

  res.status(200).json(registrations);
};

const getAllPVRegistrations = async (req, res) => {
  if (!req?.params?.REF_poolId || !req?.params?.REF_vehicleId)
    return res.status(400).json({ message: "Pool ID and Vehicle ID required" });

  const query = {
    REF_poolId: req.params.REF_poolId,
    REF_vehicleId: req.params.REF_vehicleId,
  };

  const registrations = await Registration.find(query);

  if (registrations.length === 0) {
    return res.status(404).jswon({ message: "No registrations found" });
  }

  res.status(200).json(registrations);
};

const getAllUPVRegistrations = async (req, res) => {
  if (
    !req?.params?.REF_userId ||
    !req?.params?.REF_poolId ||
    !req?.params?.REF_vehicleId
  )
    return res
      .status(400)
      .json({ message: "User ID, Pool ID and VehicleId required" });

  const query = {
    REF_userId: req.params.REF_userId,
    REF_poolId: req.params.REF_poolId,
    REF_vehicleId: req.params.REF_vehicleId,
  };

  const registrations = await Registration.find(query);

  if (registrations.length === 0) {
    return res.status(404).jswon({ message: "No registrations found" });
  }

  res.status(200).json(registrations);
};

module.exports = {
  createNewRegistration,
  updateRegistration,
  deleteRegistration,
  getRegistration,
  getAllUserRegistrations,
  getAllPoolRegistrations,
  getAllVehicleRegistrations,
  getAllUPRegistrations,
  getAllUVRegistrations,
  getAllPVRegistrations,
  getAllUPVRegistrations,
};
