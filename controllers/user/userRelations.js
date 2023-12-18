import user from "../../model/user.js";
import ifUserExists from "../../helpers/userExists.js";

export async function toogleFollowing(req, res) {
  if (!ifUserExists(req.params.targetUserName)) {
    const falseResponse = {
      purposeCompleted: false,
      message: `-> user: ${req.triggerUserName} was trying to follow a non existent user: ${req.params.targetUserName}.`,
    };

    return res.status(404).json(falseResponse);
  }

  try {
    const addingToFollowingResponse = await user.updateOne(
      {
        userName: req.triggerUserName,
      },
      { $addToSet: { userFollowing: req.params.targetUserName } }
    );

    const addingToFollowersResponse = await user.updateOne(
      {
        userName: req.params.targetUserName,
      },
      { $addToSet: { userFollowers: req.triggerUserName } }
    );

    if (
      addingToFollowingResponse.modifiedCount != 1 &&
      addingToFollowersResponse.modifiedCount != 1
    ) {
      const removeFromFollowingResponse = await user.updateOne(
        {
          userName: req.triggerUserName,
        },
        { $pull: { userFollowing: req.params.targetUserName } }
      );

      const removeFromFollowersResponse = await user.updateOne(
        {
          userName: req.params.targetUserName,
        },
        { $pull: { userFollowing: req.triggerUserName } }
      );

      if (
        removeFromFollowingResponse.modifiedCount == 1 &&
        removeFromFollowersResponse.modifiedCount == 1
      ) {
        res.status(200).json({
          purposeCompleted: true,
          message: `-> the user: ${req.triggerUserName} is now not following the user: ${req.params.otherUserName}`,
          isFollowing: false,
        });
      }
    } else {
      res.status(200).json({
        purposeCompleted: true,
        message: `-> the user: ${req.triggerUserName} is now following the user: ${req.params.otherUserName}`,
        isFollwing: true,
      });
    }
  } catch (err) {
    const errorPayload = {
      purposeCompleted: false,
      message: `->  request from user: ${req.triggerUserName} to toggle following to user: ${req.params.targetUserName}.`,
      errorOccured: true,
    };

    res.log.error(err, "-> an error has occured in toggleFollowing function.");
    return res.status(500).json(errorPayload);
  }
}
