// A file for all the functions which are in works or are not intended to be used
import user from "../model/user.js";
import axios from "axios";

export async function newVideoPost(req, res) {
  const triggerUser = await user.findOne({ userName: req.triggerUserName });
  const uploadedFile = req.file;
  axios
    .put("https://pixeldrain.com/api/file/xyz", uploadedFile)
    .then(async (response) => {
      triggerUser.userVideos.push(response.data.id);
      await triggerUser.save();
      res.send("done");
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function getVideoPost(req, res) {}
