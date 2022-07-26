const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const User = require("../models/user");
const fs = require("fs");
const path = require("path");

function signUp(req, res) {
  const user = new User();

  const { name, lastname, email, password, repeatPassword } = req.body;
  user.name = name;
  user.lastname = lastname;
  user.email = email.toLowerCase();
  user.role = "admin";
  user.password = password;
  user.active = false;

  if (!password || !repeatPassword) {
    res.status(404).send({ message: "Contraseñas Obligatorias" });
  } else {
    if (password !== repeatPassword) {
      res.status(404).send({ message: "Contraseñas tienen que ser iguales" });
    } else {
      bcrypt.hash(password, null, null, function (err, hash) {
        if (err) {
          res.status(500).send({ message: "Error al encriptar " });
        } else {
          user.password = hash;
          user.save((err, userStored) => {
            if (err) {
              res.status(500).send({ message: "El usuario ya existe." });
            } else {
              if (!userStored) {
                res.status(404).send({ message: "Error al crear el usuario." });
              } else {
                res.status(200).send({ user: userStored });
              }
            }
          });
        }
      });
    }
  }
}

function signIn(req, res) {
  const params = req.body;
  const email = params.email.toLowerCase();
  const password = params.password;

  User.findOne({ email }, (err, userStored) => {
    if (err) {
      res.status(500).send({ message: "Error Servidor." });
    } else {
      if (!userStored) {
        res.status(404).send({ message: "Usuario no encontrado" });
      } else {
        bcrypt.compare(password, userStored.password, (err, check) => {
          if (err) {
            res.status(500).send({ message: "Error Servidor." });
          } else if (!check) {
            res.status(404).send({ message: "Contraseña incorrecta ." });
          } else {
            if (!userStored.active) {
              res
                .status(200)
                .send({ code: 200, message: "Usuario no activado." });
            } else {
              res.status(200).send({
                accessToken: jwt.createAccessToken(userStored),
                refreshToken: jwt.createRefreshToken(userStored),
              });
            }
          }
        });
      }
    }
  });
}

function getUsers(req, res) {
  User.find().then((users) => {
    if (!users) {
      res.status(404).send({ message: "No se han encontrado Usuarios" });
    } else {
      res.status(200).send({ users });
    }
  });
}

function getUsersActive(req, res) {
  const query = req.query;
  User.find({ active: query.active }).then((users) => {
    if (!users) {
      res.status(404).send({ message: "No se han encontrado Usuarios" });
    } else {
      res.status(200).send({ users });
    }
  });
}

function uploadAvatar(req, res) {
  const params = req.params;

  User.findById({ _id: params.id }, (err, userData) => {
    if (err) {
      res.status(500).send({ message: "Error del Servidor." });
    } else {
      if (!userData) {
        res
          .status(404)
          .send({ message: "No se ha encontrado ningún Usuario." });
      } else {
        let user = userData;

        if (req.files) {
          let filePath = req.files.avatar.path;
          let fileName = filePath.replace(/^.*[\\\/]/, "");
          let extSplit = fileName.split(".");
          let fileExt = extSplit[1];

          if (fileExt !== "png" && fileExt !== "jpg") {
            res.status(400).send({
              message:
                "Image extension not valid. (Extensions Allowed: .png and .jpg)",
            });
          } else {
            user.avatar = fileName;
            User.findByIdAndUpdate(
              { _id: params.id },
              user,
              (err, userResult) => {
                if (err) {
                  res.status(500).send({ message: "Error del Servidor." });
                } else {
                  if (!userResult) {
                    res
                      .status(404)
                      .send({ message: "No se ha encontrado ningún Usuario." });
                  } else {
                    res.status(200).send({ avatarName: fileName });
                  }
                }
              }
            );
          }
        }
      }
    }
  });
}

function getAvatar(req, res) {
  const avatarName = req.params.avatarName;
  const filePath = `src/uploads/avatar/${avatarName}`;

  fs.access(filePath, (error) => {
    if (!error) {
      return res.sendFile(path.resolve(filePath));
    } else {
      res.status(404).sendFile({ message: "El Avatar no existe" });
    }
  });
}

async function updateUser(req, res) {
  let userData = req.body;
  userData.email = req.body.email.toLowerCase();
  const params = req.params;

  if (userData.password) {
    await bcrypt.hash(userData.password, null, null, (err, hash) => {
      if (err) {
        res.status(500).send({ message: "Error del Servidor." });
      } else {
        userData.password = hash;
      }
    });
  }

  User.findByIdAndUpdate(
    { _id: params.userId },
    userData,
    (err, userUpdate) => {
      if (err) {
        res.status(500).send({ message: "Error del Servidor." });
      } else {
        if (!userUpdate) {
          res
            .status(404)
            .send({ message: "No se ha encontrado ningún Usuario." });
        } else {
          res
            .status(200)
            .send({ message: "Usuario Actualizado correctamente." });
        }
      }
    }
  );
}

function activateUser(req, res) {
  const { userId } = req.params;
  const { active } = req.body;

  User.findByIdAndUpdate(userId, { active }, (err, userStored) => {
    if (err) {
      res.status(500).send({ message: "Error del Servidor." });
    } else {
      if (!userStored) {
        resstatus(404).send({ message: "No se ha encontrado ningún Usuario." });
      } else {
        if (active == true) {
          res.status(200).send({ message: "Usuario Activado correctamente." });
        } else {
          res
            .status(200)
            .send({ message: "Usuario Desactivado correctamente." });
        }
      }
    }
  });
}

function deleteUser(req, res) {
  const { userId } = req.params;

  User.findByIdAndDelete(userId, (err, userDelete) => {
    if (err) {
      res.status(500).send({ message: "Error del Servidor." });
    } else {
      if (!userDelete) {
        resstatus(404).send({ message: "No se ha encontrado ningún Usuario." });
      } else {
        res.status(200).send({ message: "Usuario Eliminado correctamente." });
      }
    }
  });
}

function signUpAdmin(req, res) {
  const user = new User();
  const { name, lastname, email, role, password } = req.body;
  user.name = name;
  user.lastname = lastname;
  user.email = email;
  user.role = role;
  user.active = true;

  if (!password) {
    res.status(500).send({ message: "Contraseña Obligatoria." });
  } else {
    bcrypt.hash(password, null, null, (err, hash) => {
      if (err) {
        res.status(500).send({ message: "Error al enctriptar contraseña." });
      } else {
        user.password = hash;
        user.save((error, userStored) => {
          if (error) {
            res.status(500).send({ message: "Usuario ya Existe.." });
          } else {
            if (!userStored) {
              resstatus(500).send({
                message: "Error al crear el nuevo usuario.",
              });
            } else {
              res.status(200).send({ message: "Usuario creado exitosamente" });
            }
          }
        });
      }
    });
  }
}
module.exports = {
  signUp,
  signIn,
  getUsers,
  getUsersActive,
  uploadAvatar,
  getAvatar,
  updateUser,
  activateUser,
  deleteUser,
  signUpAdmin,
};
