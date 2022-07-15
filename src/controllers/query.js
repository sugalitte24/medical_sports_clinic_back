const Query = require("../models/query");

function createQueryPatient(req, res) {
  const query = new Query();
  const patientId = req.params.patientId;

  const {
    hear_rate,
    blood_pressure,
    weight,
    size,
    o2_saturation,
    analysis,
    plan_manage,
    diagnosis,
    evolution,
  } = req.body;
  query.user_id = patientId;
  query.hear_rate = hear_rate;
  query.blood_pressure = blood_pressure;
  query.weight = weight;
  query.size = size;
  query.o2_saturation = o2_saturation;
  query.analysis = analysis;
  query.plan_manage = plan_manage;
  query.diagnosis = diagnosis;
  query.evolution = evolution;

  if (
    !evolution ||
    !diagnosis ||
    !plan_manage ||
    !hear_rate ||
    !blood_pressure ||
    !o2_saturation ||
    !weight ||
    !size
  ) {
    res.status(404).send({ message: "Complete todos los datos." });
  } else {
    query.save((err, queryStored) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor." });
      } else {
        if (!queryStored) {
          res.status(404).send({ message: "Error al guardar la evolución." });
        } else {
          res.status(200).send({ user: queryStored });
        }
      }
    });
  }
}

function getQueryPatient(req, res) {
  const patientId = req.params.patientId;
  Query.find({ user_id: patientId }).then((query) => {
    if (query.length == 0) {
      res.status(404).send({
        message: "No se ha encontrado historia para el paciente.",
      });
    } else {
      console.log(query);
      res.status(200).send({ query });
    }
  });
}

module.exports = {
  createQueryPatient,
  getQueryPatient,
};
