const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const profileValidations = require("../validations/password.validation");
const router = express.Router();
const profileController = require("../controllers/password.controller");

// Token authentication for all routes defined in this file
router.use(auth());

// Routes: Upload the post
router
  .route("/")
  .patch(
    validate(profileValidations.validatePassword),
    profileController.password
  );

module.exports = router;

