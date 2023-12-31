import user from "../model/user.js";

export async function ifUserExists(req, res) {
  try {
    const ifUserExists = await user.findOne(
      { userName: req.body.tempValue },
      { _id: true }
    );

    const responsePayload = {
      purposeCompleted: true,
    };

    if (ifUserExists) {
      responsePayload.userExists = true;
    } else {
      responsePayload.userExists = false;
    }

    res.log.info(
      responsePayload,
      "-> response payload for ifUserExists function."
    );
    res.status(200).json(responsePayload);
  } catch (err) {
    const errorPayload = {
      purposeCompleted: false,
      message: `-> an error has occured in checking if the user exists.`,
      errorOccured: true,
    };

    res.log.error(err, "-> an error has occured in the ifUserExists function");
    res.status(500).json(errorPayload);
  }
}
