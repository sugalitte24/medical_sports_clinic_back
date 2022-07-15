const express = require("express");
const QueryController = require("../controllers/query");
const md_auth = require("../middleware/authenticated");
const api = express.Router();

api.get("/get-query/:patientId", QueryController.getQueryPatient);
api.post("/create-query/:patientId", QueryController.createQueryPatient);

module.exports = api;
