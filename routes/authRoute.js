const route = require("express").Router();
const auth = require("../Controller/AuthCTL.js");

route.post("/register", auth.register);
route.post("/login", auth.login);
route.post("/logout", auth.logout);

module.exports = route;