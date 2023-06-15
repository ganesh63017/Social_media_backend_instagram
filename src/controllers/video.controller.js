const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const bcryptThePassword = require("bcryptjs");
const videoSchema = require("../models/video.model");

const cloud = require("cloudinary").v2;
const fs = require("fs");

cloud.config({
  cloud_name: "duivdefdy",
  api_key: "369672334532652",
  api_secret: "460IDIJ4yVGig1Zu6HKvE5mUNAE",
  secure: true,
});

async function uploadToCloudinary(locaFilePath) {
  // locaFilePath :
  // path of image which was just uploaded to "uploads" folder

  var mainFolderName = "main";
  // filePathOnCloudinary :
  // path of image we want when it is uploded to cloudinary
  var filePathOnCloudinary = mainFolderName + "/" + locaFilePath;



  return cloud.uploader

    .upload(locaFilePath, { resource_type: "video" })
    .then((result) => {
      // Image has been successfully uploaded on cloudinary
      // So we dont need local image file anymore
      // Remove file from local uploads folder
      fs.unlinkSync(locaFilePath);

      return {
        message: "Success",
        url: result.url,
      };
    })
    .catch((error) => {
      // Remove file from local uploads folder
      fs.unlinkSync(locaFilePath);
      return { message: error };
    });
}

const uploadVideo = catchAsync(async (req, res, next) => {
  const { _id } = req.user;

  try {
    var locaFilePath = req.file;
    
    var result = await uploadToCloudinary(locaFilePath.path);
    console.log(result)
    if(result.url){
      const newVideo = new videoSchema({
        created_by: _id,
        url: result.url,
        likes: [],
        title: req.body.title,
        comments: [],
        disLikes:[]
      });
      await newVideo.save();
      return res.status(200).json({
        message: `Video is Successfully Uploaded`,
      });

    }
    else{
      throw new Error("serever Error")
    }
    
    
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

const getVideos = catchAsync(async (req, res) => {
  try {
    const data = await videoSchema.find() .sort({ _id: -1 })
    .populate("created_by", "lastName firstName profile_pic");
    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

module.exports = { uploadVideo, getVideos };
