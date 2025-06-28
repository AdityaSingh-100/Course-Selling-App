const { Router } = require("express"); // `
const courseRouter = Router();

// you would expect the user to pay you the money
courseRouter.post("/purchase", function (req, res) {
  res.json({
    message: "course purchase endpoint",
  });
});

courseRouter.get("/preview", function (req, res) {
  res.json({
    message: "course preview endpoint",
  });
});

module.exports = {
  courseRouter: courseRouter,
};
