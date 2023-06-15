const multer = require("multer");

const uploadVideo = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "videos");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + ".mp4");
    },
  }),
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(mp4)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload a Video"));
    }
    cb(undefined, true);
  },
}).single("video");

module.exports = uploadVideo;
