// mongoose models
import user from "../../model/user.js";
import imagePost from "../../model/imagePost.js";
import comment from "../../model/comment.js";

// helper functions / values
import hashPassword from "../../helpers/hashPassword.js";
import {
  createUserAccessToken,
  createUserRefreshToken,
} from "../../helpers/createTokens.js";
import createCookie from "../../helpers/createCookie.js";

export async function newUser(req, res) {
  try {
    const unhashedPassword = req.body.password;
    const hashedPassword = await hashPassword(unhashedPassword);

    // setting & creating the user in database
    const newUser = await user.create({
      userName: req.body.userName,
      userBio: req.body.userBio,
      userPassword: hashedPassword,
      userDisplayPictureFull: req.imageUploadedData.url,
      userDisplayPictureMedium: req.imageUploadedData.medium.url,
      userDisplayPictureThumb: req.imageUploadedData.thumb.url,
    });

    // creating access jwt & cookie
    const userAccessTokenPayload = {
      id: newUser.id,
      userName: newUser.userName,
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

    // creating refresh jwt & cookie
    const userRefreshTokenPayload = { message: "-> I am a refresh token." };
    const userRefreshToken = createUserRefreshToken(userRefreshTokenPayload);
    const userRefreshCookieMaxAge = 1000 * 60 * 60 * 24 * 7 * 4;
    createCookie(
      req,
      res,
      "userRefreshToken",
      userRefreshToken,
      userRefreshCookieMaxAge
    );

    // sending a response
    const responsePayload = {
      purposeCompleted: true,
      message: `-> User with userName: ${req.body.userName} created.`,
      data: { newUser },
    };

    res.log.info(responsePayload, "-> response payload for newUser function");
    res.status(201).json(responsePayload);
  } catch (err) {
    //sending a response
    const errorPayload = {
      purposeCompleted: false,
      message: `-> an error has occured in creating a new user.`,
      errorOccured: true,
    };

    res.log.error(err, "-> an error has occured in the newUser function");
    res.status(500).json(errorPayload);
  }
}

export async function deleteUser(req, res) {
  try {
    const triggerUser = await user.findOne(
      { _id: req.triggerUserId },
      {
        userName: true,
        userFollowers: true,
        userFollowing: true,
        userPosts: true,
      }
    );

    // deleting all comments made by the user
    const deleteComments = await comment.deleteMany({
      commentMadeBy: triggerUser.userName,
    });

    // deleting all posts made by the user
    const deletedPosts = await imagePost.deleteMany({
      _id: { $in: triggerUser.userPosts },
    });

    // updating the following list for the users who followed the user
    const updateFollowingForOtherUsers = await user.updateMany(
      { userFollowing: { $in: triggerUser.userName } },
      { $pull: { userFollowing: triggerUser.userName } }
    );

    // updating the followers list for the users wtriggerUserNamefollowed by the user
    const updateFollowersForOtherUsers = await user.updateMany(
      { userFollowers: { $in: triggerUser.userName } },
      { $pull: { userFollowers: triggerUser.userName } }
    );

    // deleting the user itself
    const messageFromDb = await user.deleteOne({
      userName: triggerUser.userName,
    });

    if (messageFromDb.acknowledged == true && messageFromDb.deletedCount == 1) {
      const response = {
        purposeCompleted: true,
        message: `-> successfully deleted user with userName: ${req.triggerUserName}`,
      };

      const deleteCookieExpiration = 1000 * 10;
      createCookie(req, res, "userAccessToken", "", deleteCookieExpiration);
      createCookie(req, res, "userRefreshToken", "", deleteCookieExpiration);

      res.log.info(response, "-> response for deleteUser function");
      res.status(200).json(response);
    }
  } catch (err) {
    const errorPayload = {
      purposeCompleted: false,
      message: `-> user: ${req.triggerUserName} could not be deleted successfully`,
      errorOccured: true,
    };

    res.log.error(err, "-> an error has occured in the deleteUser function");
    res.status(500).json(errorPayload);
  }
}
