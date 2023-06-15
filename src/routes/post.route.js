const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const postValidations = require("../validations/post.validation");
const postController = require("../controllers/post.controller");
const router = express.Router();
const multerUpload = require("../middlewares/post.uploadmiddleware");

// Token authentication for all routes defined in this file
router.use(auth());

// Routes: Upload the post
router
  .route("/posts")
  .post(
    multerUpload,
    validate(postValidations.uploadPost),
    postController.uploadPost
  )
  .get(validate(postValidations.getPost), postController.getPosts);

router
  .route("/comments/:postId")
  .post(validate(postValidations.validateComment), postController.comments)
  .get(postController.getComments);

router
  .route("/comments/likes/:commentId")
  .post(postController.addLikesToComment);

router.route("/comments").get(postController.getAllComments);

router
  .route("/likes/:postId")
  .patch(postController.likes)
  .get(postController.getLikes);

router
  .route("/save/:postId")
  .post(postController.savePost)
  .delete(postController.deleteSavePost);

router.route("/save").get(postController.getSavedPost);

router
  .route("/comments/:postId/:commentId")
  .post(postController.replyToComment);

module.exports = router;
