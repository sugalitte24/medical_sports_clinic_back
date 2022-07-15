const express = require("express");
const PatientController = require("../controllers/patient");
const md_auth = require("../middleware/authenticated");
const api = express.Router();

api.get("/get-patient", PatientController.getPatient);
api.get(
  "/get-patient/:identification",
  PatientController.getPatientByIdentification
);
api.post("/create-patient", PatientController.createPatient);
api.put("/update-patient/:identification", PatientController.updatePatient);
api.delete("/delete-patient/:identification", PatientController.deletePatient);

module.exports = api;
