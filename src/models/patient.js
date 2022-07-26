const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PatientSchema = {
  identification: {
    type: String,
    unique: true,
  },
  document_type: String,
  clinic_history: Number,
  name: String,
  lastname: String,
  email: {
    type: String,
    unique: true,
  },
  age: Number,
  city: String,
  start_date: Date,
  birth_date: Date,
  civil_status: String,
  number_phone: String,
  gender: String,
  address: String,
  ocupation: String,
  companion: String,
  entity: String,
  reason_consultation: String,
  current_illness: String,
  pathological: String,
  surgical: String,
  tx_ai: String,
  family_history: String,
};

module.exports = mongoose.model("Patient", PatientSchema);
