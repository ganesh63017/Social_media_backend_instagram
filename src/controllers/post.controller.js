const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const postSchema = require("../models/posts.model");
const userSchema = require("../models/user.model");
const commentSchema = require("../models/comments.model");
const savedSchema = require("../models/savedPost.model");

const uploadPost = catchAsync(async (req, res) => {
  const { caption, like, location } = req.body;
  const { _id } = req.user;

  const imageUrlList = req.files.map((each) => each.filename);
  if (imageUrlList.length > 0) {
    const newPhotoUpload = new postSchema({
      created_by: _id,
      posted_photos: imageUrlList,
      likes: like,
      caption: caption,
      location: location,
    });
    await newPhotoUpload.save();
    return res.status(httpStatus.CREATED).json({
      message: "Successfully Uploaded.",
    });
  }
  return res.status(400).json({
    message: "Minimum 1 Photo is Required Max 5",
  });
});

const getPosts = catchAsync(async (req, res) => {
  try {
    const feeds = await postSchema
      .find({})
      .sort({ _id: -1 })
      .populate("created_by", "lastName firstName profile_pic");
    res.status(httpStatus.CREATED).json(feeds);
  } catch (e) {
    res.status(400).json({
      message: "Unable To get Posts",
    });
  }
});

const savePost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const { _id } = req.user;
  try {
    const feeds = await postSchema
      .findOne({ _id: postId })
      .populate("created_by", "lastName firstName profile_pic");
    const savepost = new savedSchema({
      post_id: postId,
      saved_by: _id,
      savedPost: feeds,
    });
    await savepost.save();
    res.status(200).json({ message: "saved successfully" });
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
});

const deleteSavePost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const { _id } = req.user;
  try {
    const data = await savedSchema.findOneAndDelete({ post_id: postId });
    res.status(200).json({ message: "Removed Successfully" });
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
});

const getSavedPost = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const post = await savedSchema.find({ saved_by: _id });
  res.status(201).json({ data: post });
});

const comments = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const { comment } = req.body;
  const { postId } = req.params;

  try {
    const newComment = new commentSchema({
      created_by: _id,
      post_id: postId,
      comment,
    });
    await newComment.save();
    return res.status(httpStatus.CREATED).json({
      message: `Successfully Updated the Comment`,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error Raised in internal Server`,
    });
  }
});

const getComments = catchAsync(async (req, res) => {
  const { postId } = req.params;
  try {
    const commentDetails = await commentSchema
      .find({ post_id: postId })
      .populate("created_by", "lastName firstName profile_pic");
    return res.status(httpStatus.CREATED).json({
      message: `Successful`,
      data: commentDetails,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error Raised in internal Server`,
    });
  }
});

const getAllComments = catchAsync(async (req, res) => {
  try {
    const commentDetails = await commentSchema.find({});

    return res.status(200).json({
      message: `Successful`,
      data: commentDetails,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error Raised in internal Server`,
    });
  }
});

const likes = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const { _id } = req.user;

  try {
    const post = await postSchema.findById(postId);
    const likedPost = post.likes.filter(
      (like) => JSON.stringify(like) === JSON.stringify(_id)
    );
    if (likedPost.length > 0) {
      const filteredLikes = post.likes.filter(
        (like) => JSON.stringify(like) !== JSON.stringify(_id)
      );

      await postSchema.updateOne(
        { _id: postId },
        { $set: { likes: filteredLikes } }
      );

      return res.status(201).json({ message: "success" });
    } else {
      const addedNewLike = [...post.likes, _id];
      await postSchema.updateOne(
        { _id: postId },
        { $set: { likes: addedNewLike } }
      );
      return res.status(201).json({ message: "Success" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "SomeThing went Wrong", error: err.message });
  }
});

const getLikes = catchAsync(async (res) => {
  try {
    const posts = await postSchema.find({});
    if (posts) {
      return res.status(200).json({ message: "success", data: posts });
    } else {
      throw new Error("id not found");
    }
  } catch (e) {
    return res.status(400).json({ message: "Failed", error: e.message });
  }
});

const addLikesToComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const { _id } = req.user;

  try {
    const comment = await commentSchema.findById(commentId);

    const likedPost = comment.likes.filter(
      (like) => JSON.stringify(like) === JSON.stringify(_id)
    );
    if (likedPost.length > 0) {
      const filteredLikes = comment.likes.filter(
        (like) => JSON.stringify(like) !== JSON.stringify(_id)
      );

      await commentSchema.updateOne(
        { _id: commentId },
        { $set: { likes: filteredLikes } }
      );

      return res.status(201).json({ message: "success" });
    } else {
      const addedNewLike = [...comment.likes, _id];
      await commentSchema.updateOne(
        { _id: commentId },
        { $set: { likes: addedNewLike } }
      );
      return res.status(201).json({ message: "Success" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "SomeThing went Wrong", error: err.message });
  }
});

const replyToComment = catchAsync(async (req, res) => {
  const { postId, commentId } = req.params;
  const { _id } = req.user;
  try {
    const commentData = await commentSchema.findById({ _id: commentId });
    const user = await userSchema.findById({ _id });
    const obj = {
      time: new Date(),
      commented_by: _id,
      userDetails: user,
      comment: req.body.comment,
    };

    commentData.comments.push(obj);
    commentData.save();
    return res.status(200).json({ message: "successfully commented" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = {
  uploadPost,
  getPosts,
  comments,
  getComments,
  likes,
  getLikes,
  getAllComments,
  getSavedPost,
  savePost,
  deleteSavePost,
  addLikesToComment,
  replyToComment,
};
