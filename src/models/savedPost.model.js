const mongoose = require("mongoose");

const savedPostsSchema = mongoose.Schema(
  {
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: "posts" },
    saved_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    savedPost: { type: Object },
  },
  {
    timestamps: true,
  }
);

const savedPost = mongoose.model("savedPosts", savedPostsSchema);

module.exports = savedPost;
