const Pool = require("../model/Pool");
const User = require("../model/User");

const getAllPools = async (req, res) => {
  const pools = await Pool.find();
  if (!pools) return res.status(204).json({ message: "No pools found." });
  res.json(pools);
};

const createNewPool = async (req, res) => {
  if (!req?.body?.displayName || !req?.body?.REF_ownerId) {
    return res
      .status(400)
      .json({ message: "Display name and REF_ownerId are required" });
  }

  try {
    const users = req.body.users || [];
    const vehicles = req.body.vehicles || [];
    const newPool = await Pool.create({
      displayName: req.body.displayName,
      REF_ownerId: req.body.REF_ownerId,
      users: [{ REF_userId: req.body.REF_ownerId }, ...users],
      vehicles: [...vehicles],
      stats: req.body.stats,
      isPublic: req.body.isPublic,
    });

    // Update the owner's user document
    const updatedUser = await User.findByIdAndUpdate(
      req.body.REF_ownerId,
      { $push: { pools: { REF_poolId: newPool._id } } },
      { new: true, safe: true, upsert: false } // options
    );

    if (!updatedUser) {
      return res.status(204).json({
        message: `No owner matches provided owner ID ${req.body.REF_ownerId}.`,
      });
    }

    res.status(201).json(newPool);
  } catch (err) {
    console.error(err);
  }
};

const updatePool = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }

  const pool = await Pool.findOne({ _id: req.body.id }).exec();
  if (!pool) {
    return res
      .status(204)
      .json({ message: `No pool matches ID ${req.body.id}.` });
  }
  if (req.body?.displayName) pool.displayName = req.body.displayName;
  if (req.body?.REF_ownerId) pool.REF_ownerId = req.body.REF_ownerId;
  if (req.body?.users) pool.users = req.body.users;
  if (req.body?.vehicles) pool.vehicles = req.body.vehicles;
  if (req.body?.stats) pool.stats = req.body.stats;
  if (req.body?.isPublic) pool.isPublic = req.body.isPublic;
  const result = await pool.save();
  res.json(result);
};

const deletePool = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "Pool ID required." });

  const pool = await Pool.findOne({ _id: req.body.id }).exec();
  if (!pool) {
    return res
      .status(204)
      .json({ message: `No pool matches ID ${req.body.id}.` });
  }

  const ownerId = vehicle.REF_ownerId;

  const result = await pool.deleteOne(); //{ _id: req.body.id }
  if (!deleteResult.deletedCount) {
    return res.status(500).json({ message: "Failed to delete the vehicle." });
  }

  const updateUser = await User.findByIdAndUpdate(
    ownerId,
    { $pull: { pools: { REF_poolId: pool._id } } },
    { new: true } // Optional, to return the updated document
  );

  if (!updateUser) {
    return res
      .status(404)
      .json({ message: "Owner not found or update failed." });
  }

  res.json(result);
};

const getPool = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Pool ID required." });

  try {
    const pool = await Pool.findOne({ _id: req.params.id }).exec();
    if (!pool) {
      return res
        .status(204)
        .json({ message: `No pool matches ID ${req.params.id}.` });
    }
    res.json(pool);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "INVALID ID" });
  }
};

const subscribeToPool = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Pool ID required." });
  if (!req?.body?.REF_userId)
    return restart.status(400).json({ message: "User ID required." });

  //update pool
  const updatedPool = await Pool.findByIdAndUpdate(
    req.params.id,
    { $pull: { users: { REF_userId: req.body.REF_userId } } },
    { new: true, safe: true, upsert: false }
  );

  if (!updatedPool) {
    return res
      .status(204)
      .json({ message: `No pool matches ID ${req.params.id}.` });
  }

  // Update the owner's user document
  const updatedUser = await User.findByIdAndUpdate(
    req.body.REF_userId,
    { $pull: { pools: { REF_poolId: req.params.id } } },
    { new: true, safe: true, upsert: false } // options
  );

  if (!updatedUser) {
    return res
      .status(204)
      .json({ message: `No user matches ID ${req.body.REF_userId}.` });
  }

  res.json(updatedUser);
};

const unsubscribeFromPool = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Pool ID required." });
  if (!req?.body?.REF_userId)
    return restart.status(400).json({ message: "User ID required." });

  //update pool
  const updatedPool = await Pool.findByIdAndUpdate(
    req.params.id,
    { $pull: { users: { REF_userId: req.body.REF_userId } } },
    { new: true, safe: true, upsert: false }
  );

  if (!updatedPool) {
    return res
      .status(204)
      .json({ message: `No pool matches ID ${req.params.id}.` });
  }

  // Update the owner's user document
  const updatedUser = await User.findByIdAndUpdate(
    req.body.REF_userId,
    { $pull: { pools: { REF_poolId: req.params.id } } },
    { new: true, safe: true, upsert: false } // options
  );

  if (!updatedUser) {
    return res
      .status(204)
      .json({ message: `No user matches ID ${req.body.REF_userId}.` });
  }

  res.json(updatedUser);
};

const getAllUserSubscribedPools = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "user ID required." });

  const pools = await Pool.find({ REF_userId: req.params.id }).exec();
  if (!PerformanceObserverEntryList) {
    return res
      .status(204)
      .json({ message: `No pools found for user ${req.params.id}.` });
  }
  res.json(pools);
};

module.exports = {
  getAllPools,
  createNewPool,
  updatePool,
  deletePool,
  getPool,
  subscribeToPool,
  unsubscribeFromPool,
  getAllUserSubscribedPools,
};
