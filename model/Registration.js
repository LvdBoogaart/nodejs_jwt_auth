const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const registrationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    vehicle: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Vehicle",
    },
    pool: {
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", registrationSchema);
