const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const profileSchema = require("../models/user.model");
const bcryptThePassword = require("bcryptjs");

const password = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const userDetails = await profileSchema.findOne({ _id });
  const { old_password, new_password, confirm_password } = req.body;
  if (new_password === confirm_password) {
    if (await bcryptThePassword.compare(old_password, userDetails.password)) {
      if (!new_password.match(/\d/) || !new_password.match(/[a-zA-Z]/)) {
        throw new Error(
          "Password must contain at least one letter and one number"
        );
      }
      try {
        const salt = await bcryptThePassword.genSalt(8);
        const passwordHashed = bcryptThePassword.hashSync(new_password, salt);

        await profileSchema.findByIdAndUpdate(_id, {
          password: passwordHashed,
        });
        return res.status(200).json({
          message: "Successfully Updated",
        });
      } catch (e) {
        return res.status(500).json({
          error: {
            message: e.message,
          },
        });
      }
    }

    return res.status(400).json({
      message: "Password Doesn't Matched with Old Password",
    });
  } else {
    return res.status(400).json({
      message: "newPassword and confirmPassword Doesn't Matched",
    });
  }
});

module.exports = { password };
