const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const poolSchema = new Schema(
  {
    displayName: {
      type: String,
      required: true,
    },
    REF_ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    users: [
      {
        REF_userId: { type: Schema.Types.ObjectId, ref: "User" },
        userType: { type: String, default: "user" },
      },
    ],
    vehicles: [
      {
        REF_vehicleId: {
          type: Schema.Types.ObjectId,
          ref: "Vehicle",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pool", poolSchema);
