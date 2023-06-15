const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: "posts" },
    comment: { type: String, required: true },
    likes: { type: Array },
    comments: { type: Array },
  },
  {
    timestamps: true,
  }
);

const Posts = mongoose.model("comments", commentSchema);

module.exports = Posts;
