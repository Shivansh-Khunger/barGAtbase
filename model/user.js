import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  userBio: {
    type: String,
    default: "",
  },
  userPassword: { type: String, required: true },
  userDisplayPictureFull: {
    type: String,
    required: true,
  },
  userDisplayPictureMedium: {
    type: String,
    required: true,
  },
  userDisplayPictureThumb: {
    type: String,
    required: true,
  },
  userFollowers: [String],
  userFollowing: [String],
  userPosts: [String],
  userVideos: [String],
  userCreatedOn: { type: Date, default: Date.now() },
});

const user = model("User", userSchema);
export default user;
