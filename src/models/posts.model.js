const mongoose = require("mongoose");

const postsSchema = mongoose.Schema(
  {
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    posted_photos: { type: Array, required: true },
    likes: { type: Array },
    caption: { type: String, required: true },
    location: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Posts = mongoose.model("posts", postsSchema);

module.exports = Posts;
