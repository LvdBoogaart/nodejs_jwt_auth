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
        type: Schema.Types.ObjectId,
        ref: "Pool",
      },
    ],
    vehicles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Vehicle",
      },
    ],
    settings: {
      defaultPool: {
        type: Schema.Types.ObjectId,
        ref: "Pool",
      },
      defaultDarkTheme: Boolean,
    },
    refreshToken: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
