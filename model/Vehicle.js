const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehicleSchema = new Schema(
  {
    displayName: {
      type: String,
      required: true,
    },
    REF_ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    users: [
      {
        REF_userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    pools: [
      {
        REF_poolId: {
          type: Schema.Types.ObjectId,
          ref: "Pool",
        },
      },
    ],
    stats: {
      make: String,
      model: String,
      year: Number,
      avgGasPrice: Number,
      insuranceCost: Number,
      maintenanceCost: Number,
      writeOffpKm: Number,
      image: String,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
