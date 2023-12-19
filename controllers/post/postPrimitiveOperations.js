import user from "../../model/user.js";
import imagePost from "../../model/imagePost.js";
import comment from "../../model/comment.js";

export async function newPost(req, res) {
  try {
    const newPost = await imagePost.create({
      postImageFull: req.imageUploadedData.url,
      postImageMedium: req.imageUploadedData.url,
      postImageThumb: req.imageUploadedData.thumb.url,
    });

    const response = await user.updateOne(
      { _id: req.triggerUserId },
      { $push: { userPosts: newPost.id } }
    );

    if (response.modifiedCount == 1) {
      res.status(201).json({
        purposeCompleted: true,
        message: `-> new post has been created.`,
        data: newPost,
      });
    }
  } catch (err) {
    const errorPayload = {
      purposeCompleted: false,
      message: `-> new post creation failed.`,
      errorOccured: true,
    };

    res.log.error(err, "-> an error has occured in newPost function.");

    return res.status(500).json(errorPayload);
  }
}

export async function deletePost(req, res) {
  try {
    const currentPost = await imagePost.findOne(
      { _id: req.params.id },
      {
        postComments: true,
      }
    );

    await comment.deleteMany({
      _id: { $in: currentPost.postComments },
    });

    await user.updateOne(
      { userPosts: { $in: currentPost.id } },
      { $pull: { userPosts: currentPost.id } }
    );

    await imagePost.findByIdAndDelete(currentPost.id);

    res.status(200).json({
      purposeCompleted: true,
      message: "-> post has been successfully deleted.",
    });
  } catch (err) {
    const errorPayload = {
      purposeCompleted: false,
      message: `-> post deletion failed.`,
      errorOccured: true,
    };

    res.log.error(err, "-> an error has occured in deletePost function.");

    return res.status(500).json(errorPayload);
  }
}
