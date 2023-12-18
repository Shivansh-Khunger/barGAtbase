// this file acts as an index file which unites all the functions and exports them as one

import user from "../model/user.js";
import imagePost from "../model/imagePost.js";

export * from "./post/postPrimitiveOperations.js";
export * from "./post/postUpdateOperations.js";
export * from "./post/commentManagement.js";
// export * from "./post/postInWorks.js";

export async function getPost(req, res) {
  try {
    const currentPost = await imagePost.findById(req.triggerUserId);

    const responsePayload = {
      puproseCompleted: true,
      data: currentPost,
    };

    res.log.info(responsePayload, "-> response payload for getPost function");
    res.status(200).json(responsePayload);
  } catch (err) {
    const errorPayload = {
      puproseCompleted: false,
      errorOccured: true,
    };

    res.log.error(err, "-> an error has occured in the getPost function");
    res.status(500).json(errorPayload);
  }
}

export async function getAllPosts(req, res) {
  try {
    const currentUser = await user.findOne(
      { userName: req.triggerUserName },
      { userPosts: true }
    );

    const sortedPosts = await imagePost
      .find({ _id: { $in: currentUser.userPosts } })
      .sort({ postAddedDate: -1 });

    const responsePayload = {
      puproseCompleted: true,
      data: sortedPosts,
    };

    res.log.info(
      responsePayload,
      "-> response payload for getAllPosts function"
    );
    res.status(200).json(responsePayload);
  } catch (err) {
    const errorPayload = {
      puproseCompleted: false,
      errorOccured: true,
    };

    res.log.error(err, "-> an error has occured in the getAllPosts function");
    res.status(500).json(errorPayload);
  }
}
