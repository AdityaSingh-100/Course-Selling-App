const { Router } = require("express"); // `
const { userMiddleware } = require("../middleware/user");
const { purchaseModel, courseModel } = require("../db");
const courseRouter = Router();

// you would expect the user to pay you the money
courseRouter.post("/purchase", userMiddleware, async function (req, res) {
  const userId = req.userId;
  const courseId = req.body.courseId;
  //TODO : shoud check the user has actually paid the price or not
  await purchaseModel.create({
    userId,
    courseId,
  });

  res.json({
    message: "You have sucessfully bough the course",
  });
});

courseRouter.get("/preview", async function (req, res) {
  const courses = await courseModel.find({});

  res.json({
    courses,
  });
});

module.exports = {
  courseRouter: courseRouter,
};
