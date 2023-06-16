const userSchema = require("../models/user.model");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  "919265479285-toc57l2bhufa6pvgqc7nas39ac8njoqd.apps.googleusercontent.com"
);
const {
  authService,
  userService,
  tokenService,
  emailService,
} = require("../services");
const { createLogger } = require("winston");
const { password } = require("./password.controller");

const register = catchAsync(async (req, res) => {
  let user;
  try {
    user = await userService.createUser({
      ...req.body,
    });
  } catch (e) {
    throw e;
  }
  const { token, expires } = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({
    user,
    token,
    expires,
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const userValid = await userSchema.findOne({ email });
  if (userValid) {
    try {
      // if (userValid.isEmailVerified) {
      const user = await authService.loginUserWithEmailAndPassword(
        email,
        password
      );
      const { token, expires } = await tokenService.generateAuthTokens(user);
      res.status(200).json({
        user,
        token,
        expires,
      });
      // } else {
      //   res.status(400).json({ message: "Please verify your email to login" });
      // }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: "User not exists try to Register" });
  }
});

const googleLogin = catchAsync(async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      requiredAudience: process.env.google_client_id,
    });
    const { email } = ticket.getPayload();
    const user = await userSchema.findOne({ email });
    if (!user || user.deleted === true) {
      res.status(400).json({ message: "user not Exists" });
    } else {
      if (user.deleted === false) {
        const { token, expires } = await tokenService.generateAuthTokens(user);
        return res.status(200).json({
          message: "Success",
          user,
          token,
          expires,
        });
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(200).json({ token: resetPasswordToken });
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.user
  );
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(200).json({ token: verifyEmailToken });
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const self = catchAsync(async (req, res) => {
  res.send(req.user);
});

module.exports = {
  register,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  self,
};
