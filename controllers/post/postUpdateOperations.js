import imagePost from "../../model/imagePost.js";

export async function toggleLikeToPost(req, res) {
  try {
    const responseAdding = await imagePost.updateOne(
      { _id: req.triggerUserId },
      { $addToSet: { postLikes: req.triggerUserName } }
    );

    if (responseAdding.modifiedCount != 1) {
      const responseRemoving = await imagePost.updateOne(
        {
          $and: [
            { _id: req.triggerUserId },
            {
              postLikes: { $in: req.triggerUserName },
            },
          ],
        },
        { $pull: { postLikes: req.triggerUserName } }
      );

      if (responseRemoving.modifiedCount == 1) {
        return res.status(200).json({
          purposeCompleted: true,
          message: `-> ${req.triggerUserName} has unLiked the post.`,
          isUserLikingPost: false,
        });
      }
    } else {
      return res.status(200).json({
        purposeCompleted: true,
        message: `-> ${req.triggerUserName} has liked the post.`,
        isUserLikingPost: true,
      });
    }
  } catch (err) {
    const errorPayload = {
      purposeCompleted: false,
      message: `-> toogling the like has failed.`,
      errorOccured: true,
    };

    res.log.error(err, "-> an error has occured in toogleLikeToPost function.");

    return res.status(500).json(errorPayload);
  }
}

export async function updatePostCaption(req, res) {
  try {
    const response = await imagePost.updateOne(
      { _id: req.triggerUserId },
      {
        $set: {
          postCaption: req.body.updatedValue,
          postLastUpdatedDate: Date.now(),
        },
      }
    );

    if (
      response.acknowledged == true &&
      response.modifiedCount == 1 &&
      response.matchedCount == 1
    ) {
      res.status(200).json({
        purposeCompleted: true,
        message: `-> postCaption successfully updated.`,
      });
    }
  } catch (err) {
    const errorPayload = {
      purposeCompleted: false,
      message: `-> postCaption could not be updated.`,
      errorOccured: true,
    };

    res.log.error(err, "-> an error has occured in updatePostCation function.");

    return res.status(500).json(errorPayload);
  }
}

export async function updatePostImage(req, res) {
  try {
    const response = await imagePost.updateOne(
      { _id: req.triggerUserId },
      {
        $set: {
          postImageFull: req.imageUploadedData.url,
          postImageMedium: req.imageUploadedData.medium.url,
          postImageThumb: req.imageUploadedData.thumb.url,
          LastUpdatedDate: Date.now(),
        },
      }
    );

    if (
      response.acknowledged == true &&
      response.modifiedCount == 1 &&
      response.matchedCount == 1
    ) {
      res.status(200).json({
        purposeCompleted: true,
        message: `-> postImage successfully updated.`,
      });
    }
  } catch (err) {
    const errorPayload = {
      purposeCompleted: false,
      message: `-> postImage could not be updated.`,
      errorOccured: true,
    };

    res.log.error(err, "-> an error has occured in updatePostImage function.");

    return res.status(500).json(errorPayload);
  }
}
