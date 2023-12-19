import imagePost from "../../model/imagePost.js";
import comment from "../../model/comment.js";

export async function newComment(req, res) {
  try {
    const newComment = await comment.create({
      commentBody: req.body.commentBody,
      commentMadeBy: req.triggerUserName,
    });

    const response = await imagePost.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: { postLastUpdatedDate: Date.now() },
        $push: { postComments: newComment.id },
      }
    );

    if (response.modifiedCount == 1) {
      const responsePayload = {
        purposeCompleted: true,
        messsage: `-> user: ${req.triggerUserName} has posted a comment to the post with id:${req.params.id}`,
        data: newComment,
      };

      res.log.info(
        responsePayload,
        "-> response payload for newComment function."
      );
      res.status(201).json(responsePayload);
    }
  } catch (err) {
    const errorPayload = {
      purposeCompleted: false,
      message: `-> comment by user: ${req.triggerUserName} could not be posted to the post with id:${req.triggerUserId}.`,
      errorOccured: true,
    };

    res.log.error(err, "-> an error has occured in newComment function.");

    return res.status(500).json(errorPayload);
  }
}

export async function deleteComment(req, res) {
  try {
    const response = await imagePost.updateOne(
      {
        postComments: { $in: req.params.id },
      },
      {
        $pull: { postComments: req.params.id },
      }
    );

    const deletedComment = await comment.deleteOne({ _id: req.params.id });

    if (response.modifiedCount == 1 && deletedComment.deletedCount == 1) {
      res.status(200).json({
        purposeCompleted: true,
        messsage: `-> ${
          req.triggerUserName
        } has deleted a comment to the post with id:${(req.params.id)}`,
        data: newComment,
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      purposeCompleted: false,
      message: `-> comment by user: ${req.triggerUserName} could not be deleted to the post with id:${req.params.id}.`,
    });
  }
}

export async function toggleLikeToComment(req, res) {
  try {
    const responseAdding = await comment.updateOne(
      { _id: req.params.id },
      {
        $addToSet: { commentLikes: req.triggerUserName },
      }
    );

    if (responseAdding.modifiedCount != 1) {
      const responseRemoving = await comment.updateOne(
        {
          $and: [
            { _id: req.params.id },
            {
              commentLikes: { $in: req.triggerUserName },
            },
          ],
        },
        { $pull: { commentLikes: req.triggerUserName } }
      );
      if (responseRemoving.modifiedCount == 1) {
        return res.status(200).json({
          purposeCompleted: true,
          message: `-> ${req.triggerUserName} has unLiked the comment with id:${req.triggerUserId}.`,
          isUserLikingComment: false,
        });
      }
    } else {
      return res.status(200).json({
        purposeCompleted: true,
        message: `-> ${req.triggerUserName} has Liked the comment with id:${req.params.id}.`,
        isUserLikingComment: false,
      });
    }
  } catch (err) {
    const errorPayload = {
      purposeCompleted: false,
      message: `-> like by user: ${req.triggerUserName} could not be toggled to the comment with id:${req.params.id}.`,
      errorOccured: true,
    };

    res.log.error(
      err,
      "-> an error has occured in toggleLikeToComment function."
    );

    return res.status(500).json(errorPayload);
  }
}
