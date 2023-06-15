const videoController = require("../controllers/video.controller");
const express = require("express");
const auth = require("../middlewares/auth");
const validateVideo = require('../validations/Video.validation')
const validate = require("../middlewares/validate");
const router = express.Router();

const uploadVideo = require("../middlewares/video.middleware");
console.log(validateVideo)

// Token authentication for all routes defined in this file
router.use(auth());

// Routes: Upload the post
router.route("/").post(uploadVideo,validate(validateVideo.uploadVideo),videoController.uploadVideo)
.get(videoController.getVideos)

module.exports = router;
