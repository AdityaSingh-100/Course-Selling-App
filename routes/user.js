const { Router } = require("express");
const { userModel, courseModel, purchaseModel } = require("../db");
const bcrypt = require("bcrypt");
const userRouter = Router();
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middleware/user");

userRouter.post("/signup", async function (req, res) {
  const { email, password, firstName, lastName } = req.body;
  // TODO: Hash the password so plaintext pw is not stored in db  -- Done
  const hashedPassword = await bcrypt.hash(password, 10);
  // TODO : Put inside a try catch block   -- Done
  //   console.log(hashedPassword);
  try {
    userModel.create({
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

userRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({
    email: email,
  });

  if (!user) {
    res.status(403).json({
      messaage: "User does not exist in database",
    });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (passwordMatch) {
    const token = jwt.sign(
      {
        id: user._id.toString(),
      },
      JWT_USER_PASSWORD
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

userRouter.get("/purchases", userMiddleware, async function (req, res) {
  const userId = req.userId;

  const purchases = await purchaseModel.find({
    userId,
  });

  // OR - we can also do this
  // let purchaseCourseIds = [];

  // for (let i = 0; i < purchases.length; i++) {
  //   purchaseCourseIds.push(purchases[i].courseId);
  // }

  const coursesData = await courseModel.find({
    _id: { $in: purchases.map((x) => x.courseId) },
  });

  res.json({ purchases, coursesData });
});

module.exports = {
  userRouter: userRouter,
};
