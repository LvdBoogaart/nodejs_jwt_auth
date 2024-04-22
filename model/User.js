const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    displayName: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    pools: [
      {
        REF_poolId: { type: Schema.Types.ObjectId, ref: "Pool" },
      },
    ],
    vehicles: [
      {
        REF_vehicleId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    userSettings: {
      defaultPool: {
        type: Schema.Types.ObjectId,
        ref: "Pool",
      },
      defaultDarkTheme: Boolean,
      firstSetupComplete: {
        type: Boolean,
        default: false,
      },
    },
    refreshToken: [String],
  },
  { timestamps: true },
  { versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
