const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const registrationSchema = new Schema(
  {
    REF_userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    REF_vehicleId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Vehicle",
    },
    REF_poolId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Pool",
    },
    registrationType: {
      type: String,
      required: true,
      default: "km",
    },
    amount: {
      type: Number,
      required: true,
    },
    isBusiness: {
      type: Boolean,
      default: false,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", registrationSchema);
