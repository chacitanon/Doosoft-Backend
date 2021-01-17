const db = require("../models");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');


const userRegister = async (req, res) => {
  try {
    const { surname, name, email } = req.body;
    const targetUser = await db.User.findOne({ where: { name } });
    console.log(req.body);

    if (targetUser) {
      res.status(400).send({ message: "This username has been chosen" });
    } else {
      await db.User.create({
        ...req.body,
      });
      const output = `
          <div style="background-color:black;">
              <div align="center"><img src="https://res.cloudinary.com/da8hlqolk/image/upload/v1610727677/doosoft/Screenshot_17-removebg-preview_gfzy2w.png"/></div>
              <div style="color:white; text-align:center"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
              </div>
              <br/>
              <div align="center"><img src="https://res.cloudinary.com/da8hlqolk/image/upload/v1610886475/doosoft/622e196d9c24623b973a7a2770201a53_gqi31w.png"></div>
              <br/>
              <div style="color:white; text-align:center">You received this email to let you know about important changes to your account.</div>
          </div>
          `;
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      let mailOptions = {
        from: 'Doosoft <pomchacitanon@gmail.com>',
        to: `${email}`,
        subject: 'You Sign up Doosoft',
        html: `${output}`
      };

      transporter.sendMail(mailOptions, function (err, info) {
        if (err)
          console.log(err);
        else
          console.log(info);
      });


      res.status(200).send({ message: "hooray!" });

    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Sorry something went wrong" });
  }
};

const adminRegister = async (req, res) => {
  try {
    const { username, password } = req.body;
    const targetAdmin = await db.Admin.findOne({ where: { username } });
    console.log(req.body);

    if (targetAdmin) {
      res.status(400).send({ message: "This username has been chosen" });
    } else {
      bcryptjs.genSalt(Number(process.env.SALT_ROUND), async (err, salt) => {
        if (err) res.status(400).send({ message: "Sorry salt went wrong" });
        bcryptjs.hash(password, salt, async (err, hashedPw) => {
          if (err)
            res
              .status(400)
              .send({ message: "Sorry something went wrong here!" });
          await db.Admin.create({
            ...req.body,
            password: hashedPw,
          });
          res.status(200).send({ message: "hiiiiiiiiiii" });
        });
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Sorry Admin something went wrong" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { name, surname } = req.body;

    const targetUser = await db.User.findOne({ where: { name } });

    if (!targetUser) {
      res.status(400).send({ message: "wrong" });
    } else {
      bcryptjs.compare(surname, targetUser.surname, async (err, result) => {
        if (err)
          res.status(400).send({ message: "Sorry something went wrong" });
        const payload = {
          name: targetUser.name,
          id: targetUser.id,
          role: "USER",
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY, {
          expiresIn: 36000,
        });
        res.status(200).send({ token, message: "login succes!" });
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Sorry something went wrong" });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const targetAdmin = await db.Admin.findOne({ where: { username } });

    if (!targetAdmin) {
      res
        .status(400)
        .send({ message: "Username or password of Admin is wrong" });
    } else {
      bcryptjs.compare(password, targetAdmin.password, async (err, result) => {
        if (err)
          res.status(400).send({ message: "Sorry  something went wrong" });

        const payload = {
          name: targetAdmin.name,
          id: targetAdmin.id,
          role: "ADMIN",
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY, {
          expiresIn: 36000,
        });
        res.status(200).send({ token, message: "login succes!" });
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Sorry something went wrong" });
  }
};


const getUsers = async (req, res) => {
  try {
    const users = await db.User.findAll();

    res.status(200).send(users);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  };
};


module.exports = {
  userRegister,
  adminRegister,
  userLogin,
  adminLogin,
  getUsers
};
