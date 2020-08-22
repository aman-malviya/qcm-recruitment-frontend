const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//App
const app = express();

//View Engine
app.set("view engine", "ejs");

//Static Directory
app.use(express.static(__dirname + "/public"));

//Body Parser
app.use(bodyParser.urlencoded({ extended: true }));

//MongoDB Setup
mongoose.connect(
  "mongodb+srv://qcm-aman:qcmtask@cluster0.onajj.mongodb.net/qcmtask1DB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

//Chained route handlers login page
app
  .route("/")
  .get(function (req, res) {
    res.render("login");
  })
  .post(function (req, res) {
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    User.findOne({ email: userEmail }, function (err, foundItem) {
      if (err) {
        console.log(err);
      } else {
        if (foundItem) {
          if (foundItem.password === userPassword) {
            res.render("home");
          } else {
            res.redirect("/register");
          }
        } else {
          res.redirect("/register");
        }
      }
    });
  });

//Chained Route handlers register page
app
  .route("/register")
  .get(function (req, res) {
    res.render("register");
  })
  .post(function (req, res) {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    user.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.render("home");
      }
    });
  });

//Listen to Port
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
  console.log("Server has started");
});
