const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    price: {
      type: {
        org: { type: Number, default: 0.0 },
        mrp: { type: Number, default: 0.0 },
        off: { type: Number, default: 0 },
      },
      default: { org: 0.0, mrp: 0.0, off: 0 },
    },
    category: {
      type: [String],
      default: [],
    },
    ingredients: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const food = mongoose.model("foods",FoodSchema)
module.exports = food