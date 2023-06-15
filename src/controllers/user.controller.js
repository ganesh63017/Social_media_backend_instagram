const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");
const { postsSchema } = require("../models");
const userSchemaData = require("../models/user.model");
const { email } = require("../config/config");
const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser({
    _org: req.user._org,
    ...req.body,
  });
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const { _id } = req.params;
  const result = await userSchemaData.findOne(_id);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.json({ message: "Success", user: req.user });
});

const updateUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { _id } = req.user;

  is_valid_number = req.body.mobile_number.includes("+91");

  const userData = await userSchemaData.findOne({ userId });
  const { email } = req.body;

  if (is_valid_number) {
    if (userData.email !== req.body.email) {
      const findEmail = await userSchemaData.findOne({ email });
      if (findEmail.email !== req.body.email) {
        res.status(400).json({ message: "Email Already Exists Try new One" });
      } else {
        try {
          if (JSON.stringify(userId) === JSON.stringify(_id)) {
            await userService.updateUserById(req.params.userId, {
              ...req.body,
            });
            res.status(200).json({
              message: "Successfully Updated details",
            });
          } else {
            throw new Error("please Check userId");
          }
        } catch (error) {
          res.json({ message: error.message });
        }
      }
    } else {
      try {
        if (JSON.stringify(userId) === JSON.stringify(_id)) {
          await userService.updateUserById(req.params.userId, req.body);
          res.status(200).json({ message: "Successfully Updated" });
        } else {
          throw new Error("please Check userId");
        }
      } catch (error) {
        res.json({ message: error.message });
      }
    }
  } else {
    res.status(400).json({ message: "Please Country Code must be Indian +91" });
  }
});

const updateOrg = catchAsync(async (req, res) => {
  const org = await userService.updateOrgById(req.params.orgId, req.body);
  res.send(org);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const updateProfilePic = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { _id } = req.user;

  try {
    if (JSON.stringify(userId) === JSON.stringify(_id)) {
      await userSchemaData.findByIdAndUpdate(_id, {
        profile_pic: req.file.filename,
      });

      res.status(200).json({ message: "Photo is Successfully Uploaded" });
    } else {
      throw new Error("Id Is not found");
    }
  } catch (error) {
    res.status(400).json({ message: "Failed", error: error.message });
  }
});

const deleteProfilePic = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { _id } = req.user;
  try {
    if (JSON.stringify(userId) === JSON.stringify(_id)) {
      await userSchemaData.findByIdAndUpdate(_id, {
        profile_pic: "",
      });

      res.status(200).json({ message: "Photo is Successfully Deleted" });
    } else {
      throw new Error("Id Is not found");
    }
  } catch (error) {
    res.status(400).json({ message: "Failed", error: error.message });
  }
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateOrg,
  updateProfilePic,
  deleteProfilePic,
};
