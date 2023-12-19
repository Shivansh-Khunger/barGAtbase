import user from "../../model/user.js";
import createCookie from "../../helpers/createCookie.js";
import { createUserAccessToken } from "../../helpers/createTokens.js";
import comment from "../../model/comment.js";

export async function updateUserBio(req, res) {
  try {
    // updating the userBio
    const response = await user.updateOne(
      { _id: req.triggerUserId },
      { $set: { userBio: req.body.updatedBio } }
    );

    // checking if it got updated
    if (
      response.acknowledged == true &&
      response.modifiedCount == 1 &&
      response.matchedCount == 1
    ) {
      return res.status(200).json({
        purposeCompleted: true,
        message: `-> userBio successfully updated.`,
      });
    }
  } catch (err) {
    const errorPayload = {
      purposeCompleted: false,
      message: `-> userBio could not be updated.`,
      errorOccured: true,
    };

    res.log.error(err, "-> an error has occured in updateUserBio function.");

    return res.status(500).json(errorPayload);
  }
}

export async function updateUserName(req, res) {
  try {
    // updating the userName
    const response = await user.updateOne(
      { _id: req.triggerUserId },
      { $set: { userName: req.body.updatedUserName } }
    );

    // checking if it got updated
    if (
      response.acknowledged == true &&
      response.modifiedCount == 1 &&
      response.matchedCount == 1
    ) {
      comment.updateMany(
        {
          commentMadeBy: req.triggerUserName,
        },
        { $set: { commentMadeBy: req.body.updatedUserName } }
      );

      // creating a new cookie for updated name
      const userAccessTokenPayload = {
        id: req.triggerUserId,
        userName: req.body.updatedUserName,
      };
      const userAccessToken = createUserAccessToken(userAccessTokenPayload);
      const userAccessCookieMaxAge = 1000 * 60 * 60 * 24 * 2;
      createCookie(
        req,
        res,
        `userAccessToken`,
        userAccessToken,
        userAccessCookieMaxAge
      );

      return res.status(200).json({
        purposeCompleted: true,
        message: `-> userName successfully updated.`,
      });
    }
  } catch (err) {
    const errorPayload = {
      purposeCompleted: false,
      message: `-> userName could not be updated.`,
      errorOccured: true,
    };

    res.log.error(err, "-> an error has occured in updateUserName function.");

    return res.status(500).json(errorPayload);
  }
}

export async function updateUserDisplayPicture(req, res) {
  try {
    // updating the userDisplayPicture
    const response = await user.updateOne(
      {
        _id: req.triggerUserId,
      },
      {
        $set: {
          userDisplayPictureFull: req.imageUploadedData.url,
          userDisplayPictureMedium: req.imageUploadedData.medium.url,
          userDisplayPictureThumb: req.imageUploadedData.thumb.url,
        },
      }
    );

    // checking if it got updated
    if (
      response.acknowledged == true &&
      response.modifiedCount == 1 &&
      response.matchedCount == 1
    ) {
      res.status(200).json({
        purposeCompleted: true,
        message: `-> userDisplayPicture for successfully updated.`,
      });
    }
  } catch (err) {
    const errorPayload = {
      purposeCompleted: false,
      message: `-> userDisplayPicture could not be updated.`,
      errorOccured: true,
    };

    res.log.error(
      err,
      "-> an error has occured in updateUserDisplayPicture function."
    );

    return res.status(500).json(errorPayload);
  }
}
