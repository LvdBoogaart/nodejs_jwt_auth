const Pool = require("../model/Pool");

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
    const result = await Pool.create({
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
  const result = await pool.deleteOne(); //{ _id: req.body.id }
  res.json(result);
};

const getPool = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Pool ID required." });

  const pool = await Pool.findOne({ _id: req.params.id }).exec();
  if (!pool) {
    return res
      .status(204)
      .json({ message: `No pool matches ID ${req.params.id}.` });
  }
  res.json(pool);
};

module.exports = {
  getAllPools,
  createNewPool,
  updatePool,
  deletePool,
  getPool,
};
