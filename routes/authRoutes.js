const route = require("express").Router();
const passport = require("passport");
const controller = require("../controllers/authController");


passport.serializeUser(function (user, done) {
  console.log("Hello this is serialize");
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});



route.post("/register", controller.userRegister);
route.post("/login", controller.userLogin);
route.post("/admin/register", controller.adminRegister);
route.post("/admin/login", controller.adminLogin);
route.get("/getUsers", controller.getUsers);

module.exports = route;
