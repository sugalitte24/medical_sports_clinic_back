const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuerySchema = {
  user_id: String,
  hear_rate: Number,
  blood_pressure: String,
  weight: Number,
  size: Number,
  imc: Number,
  o2_saturation: Number,
  analysis: String,
  plan_manage: String,
  diagnosis: String,
  evolution: String,
};

module.exports = mongoose.model("Query", QuerySchema);
