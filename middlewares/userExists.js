import user from "../model/user.js";

async function ifUserExists(req, res, next) {
  const ifUserExists = await user.findOne(
    { _id: req.triggerUserId },
    { _id: true }
  );

  if (ifUserExists) {
    next();
  } else {
    const falseResponse = {
      message: `-> cannot process request as the user: ${req.triggerUserName} does not exists.`,
      ifUserExists: false,
    };

    res.log.warn(
      falseResponse,
      `-> a non existent user: ${req.triggerUserName} with ip: ${req.ip} tried to access the endpoint.`
    );

    return res.status(404).json(falseResponse);
  }
}

export default ifUserExists;
