const express = require("express");
const UserController = require("../controllers/user");
const multipart = require("connect-multiparty");
const md_auth = require("../middleware/authenticated");
const md_upload_avatar = multipart({ uploadDir: "src/uploads/avatar" });
const api = express.Router();

api.post("/sign-up", UserController.signUp);
api.post("/sign-in", UserController.signIn);
api.get("/get-user", [md_auth.ensureAuth], UserController.getUsers);
api.get(
  "/get-user-active",
  [md_auth.ensureAuth],
  UserController.getUsersActive
);
api.put(
  "/upload-avatar/:id",
  [md_auth.ensureAuth, md_upload_avatar],
  UserController.uploadAvatar
);
api.get("/get-avatar/:avatarName", UserController.getAvatar);
api.put(
  "/update-user/:userId",
  [md_auth.ensureAuth],
  UserController.updateUser
);
api.put(
  "/activate-user/:userId",
  [md_auth.ensureAuth],
  UserController.activateUser
);
api.delete(
  "/delete-user/:userId",
  [md_auth.ensureAuth],
  UserController.deleteUser
);
api.post("/signUpAdmin", [md_auth.ensureAuth], UserController.signUpAdmin);

module.exports = api;
