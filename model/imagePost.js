import mongoose from "mongoose";

const { Schema, model } = mongoose;

const postSchema = new Schema({
  postImageFull: String,
  postImageMedium: String,
  postImageThumb: String,
  postCaption: { type: String, default: "" },
  postAddedDate: { type: Date, default: Date.now() },
  postLastUpdatedDate: { type: Date, default: Date.now() },
  postLikes: [String],
  postComments: [String],
});

const imagePost = model("imagePost", postSchema);

export default imagePost;
