const mongoose = require("mongoose");

const videosSchema = mongoose.Schema(
  {
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type:String,
      allowNull: false,
    },
    likes: { type: Array },
    disLikes: { type: Array },
    comments:{type:Array},
    url: {
      type: String,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

const Videos = mongoose.model("videos", videosSchema);

module.exports = Videos;
