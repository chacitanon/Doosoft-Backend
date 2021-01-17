
require('dotenv').config();
require('colors');


const express = require('express');
const cors = require('cors');
const db = require('./models');
const passport = require('passport');

const authRoutes = require('./routes/authRoutes');



const app = express();
require("./config/passport/passport");

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use("/auth", authRoutes);



app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: err.message });
});


db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log(`DATABASE HAS BEEN SYNCING`.cyan.bold.underline);
  })
  .catch((err) => {
    console.log(`There might be some err : ${err}`.red.bold.bgWhite);
  });

const PORT = process.env.PORT || 7000;

app.listen(PORT, () =>
  console.log(`SERVER IS RUNNING ON ${PORT}`.magenta.bold.bgWhite.underline)
);
