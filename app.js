const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const { API_VERSION } = require("./config");

//Load Routings
const authRoutes = require("./src/routers/auth");
const userRoutes = require("./src/routers/user");
const patientRoutes = require("./src/routers/patient");
const queryRoutes = require("./src/routers/query");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure Header HTTP
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

//Router Basic
app.use(`/cmd/${API_VERSION}`, userRoutes);
app.use(`/cmd/${API_VERSION}`, authRoutes);
app.use(`/cmd/${API_VERSION}`, patientRoutes);
app.use(`/cmd/${API_VERSION}`, queryRoutes);

module.exports = app;
