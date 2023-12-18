import jwt from "jsonwebtoken";
import handleTokenErrors from "../helpers/handleTokenErrors.js";

function ifTokenIsValid(req, res, next) {
  try {
    const accessTokenDecode = jwt.verify(
      req.signedCookies.userAccessToken,
      process.env.JWT_ACCESS_SECRET_KEY
    );

    if (accessTokenDecode) {
      req.triggerUserId = accessTokenDecode.id;
      req.triggerUserName = accessTokenDecode.userName;

      logger.info("-> the token sent has been successfully verified.");
      next();
    }
  } catch (err) {
    handleTokenErrors(req, res, err, `accessToken`);
  }
}

export default ifTokenIsValid;
