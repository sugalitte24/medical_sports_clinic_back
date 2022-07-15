const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 3977;
const { API_VERSION, IP_SERVER, PORT_DB } = require("./config");

mongoose.connect(
  `mongodb://${IP_SERVER}:${PORT_DB}/cmd`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, res) => {
    if (err) {
      throw err;
    } else {
      console.log("Connect.");

      app.listen(port, () => {
        console.log(
          `Conectado a http://${IP_SERVER}:${port}/cmd/${API_VERSION}`
        );
      });
    }
  }
);
