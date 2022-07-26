const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 3977;
const { API_VERSION, IP_SERVER, PORT_DB } = require("./config");

mongoose.connect(
  //`mongodb://${IP_SERVER}:${PORT_DB}/cmd`,--> Local
  `mongodb+srv://cdm_user:cmd_user_1234@clinicamedicadeportiva.bctc6.mongodb.net/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, res) => {
    if (err) {
      throw err;
    } else {
      console.log("Connect.");

      app.listen(process.env.PORT, "0.0.0.0", () => {
        console.log(
          `Conectado a http://${IP_SERVER}:${port}/cmd/${API_VERSION}`
        );
      });
    }
  }
);
