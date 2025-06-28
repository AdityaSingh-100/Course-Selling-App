const { Router } = require("express");
const adminRouter = Router();
const { adminModel } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_ADMIN_PASSWORD = "aditya@123";

adminRouter.post("/signup", async function (req, res) {
  const { email, password, firstName, lastName } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  //   console.log(hashedPassword);
  try {
    adminModel.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });
  } catch (e) {
    res.json({
      message: "User already exists",
      error: e.message,
    });
  }
  res.json({
    message: "You are signed up",
  });
});

adminRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;

  const admin = await adminModel.findOne({
    email: email,
  });

  if (!admin) {
    res.status(403).json({
      messaage: "User does not exist in database",
    });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, admin.password);

  if (passwordMatch) {
    const token = jwt.sign(
      {
        id: admin._id.toString(),
      },
      JWT_ADMIN_PASSWORD
    );

    res.json({
      token: token,
      message: "You are signed in",
    });
  } else {
    res.status(403).json({
      message: "Incorrect Credentials",
    });
  }
});

adminRouter.post("/", function (req, res) {
  res.json({
    message: "signup endpoint",
  });
});
adminRouter.put("/", function (req, res) {
  res.json({
    message: "signup endpoint",
  });
});
adminRouter.get("/bulk", function (req, res) {
  res.json({
    message: "signup endpoint",
  });
});

module.exports = {
  adminRouter: adminRouter,
};
