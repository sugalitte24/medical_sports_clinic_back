const Patient = require("../models/patient");
const moment = require("moment");

function createPatient(req, res) {
  const patient = new Patient();

  const {
    identification,
    document_type,
    clinic_history,
    name,
    lastname,
    email,
    city,
    birth_date,
    civil_status,
    number_phone,
    gender,
    address,
    ocupation,
    companion,
    entity,
    reason_consultation,
    current_illness,
    pathological,
    surgical,
    tx_ai,
    family_history,
  } = req.body;
  patient.identification = identification;
  patient.document_type = document_type;
  patient.clinic_history = clinic_history;
  patient.name = name;
  patient.lastname = lastname;
  patient.email = email.toLowerCase();
  patient.age = getAge(birth_date);
  patient.city = city;
  patient.start_date = moment();
  patient.birth_date = birth_date;
  patient.civil_status = civil_status;
  patient.number_phone = number_phone;
  patient.gender = gender;
  patient.address = address;
  patient.ocupation = ocupation;
  patient.companion = companion;
  patient.entity = entity;
  patient.reason_consultation = reason_consultation;
  patient.current_illness = current_illness;
  patient.pathological = pathological;
  patient.surgical = surgical;
  patient.tx_ai = tx_ai;
  patient.family_history = family_history;

  if (!identification || !name || !lastname || !email || !birth_date) {
    res.status(404).send({ message: "Complete todos los datos." });
  } else {
    patient.save((err, patientStored) => {
      if (err) {
        res
          .status(500)
          .send({ message: "El paciente ya existe o Correo ya registrado." });
      } else {
        if (!patientStored) {
          res.status(500).send({ message: "Error al crear el paciente." });
        } else {
          res.status(200).send({ message: "Paciente creado Exitosamente." });
        }
      }
    });
  }
}

function getPatient(req, res) {
  Patient.find().then((patient) => {
    if (!patient) {
      res.status(404).send({ message: "No se han encontrado Pacientes" });
    } else {
      res.status(200).send({ patient });
    }
  });
}

function getPatientByIdentification(req, res) {
  const identification_p = req.params.identification;
  Patient.findOne({ identification: identification_p }).then((patient) => {
    if (!patient) {
      res.status(404).send({ message: "No se ha encontrado el paciente." });
    } else {
      res.status(200).send({ patient });
    }
  });
}

function updatePatient(req, res) {
  let patientData = req.body;
  const identification_p = req.params.identification;

  Patient.findOneAndUpdate(
    { identification: identification_p },
    patientData,
    (err, patientUpdate) => {
      if (err) {
        res.status(500).send({ message: "Error del Servidor." });
      } else {
        if (!patientUpdate) {
          res
            .status(404)
            .send({ message: "No se ha encontrado ningún paciente." });
        } else {
          res
            .status(200)
            .send({ message: "Paciente Actualizado correctamente." });
        }
      }
    }
  );
}

function deletePatient(req, res) {
  const identification_p = req.params.identification;

  Patient.findOneAndDelete(
    { identification: identification_p },
    (err, patientDelete) => {
      if (err) {
        res.status(500).send({ message: "Error del Servidor." });
      } else {
        if (!patientDelete) {
          resstatus(404).send({
            message: "No se ha encontrado ningún Paciente.",
          });
        } else {
          res
            .status(200)
            .send({ message: "Paciente Eliminado correctamente." });
        }
      }
    }
  );
}

const getAge = (birth_date) => {
  const currentDate = new Date();
  const currentYear = parseInt(currentDate.getFullYear());
  const currentMonth = parseInt(currentDate.getMonth() + 1);
  const currentDay = parseInt(currentDate.getDate());

  const yearBorn = parseInt(String(birth_date).substring(0, 4));
  const monthBorn = parseInt(String(birth_date).substring(5, 7));
  const dayBorn = parseInt(String(birth_date).substring(8, 10));

  let age = currentYear - yearBorn;
  if (currentMonth < monthBorn) {
    age--;
  } else if (currentMonth === monthBorn) {
    if (currentDay < dayBorn) {
      age--;
    }
  }
  return age;
};

module.exports = {
  createPatient,
  getPatient,
  getPatientByIdentification,
  updatePatient,
  deletePatient,
};
