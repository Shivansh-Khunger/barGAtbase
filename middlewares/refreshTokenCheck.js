import jwt from "jsonwebtoken";
import handleTokenErrors from "../helpers/handleTokenErrors.js";

function isRefreshTokenValid(req, res, next) {
  const refreshTokenDecode = jwt.verify(
    req.signedCookies.userRefreshToken,
    process.env.JWT_REFRESH_SECRET_KEY
  );

  if (refreshTokenDecode) {
    next();
  } else {
    handleTokenErrors(req, res, err, `refreshtoken`);
  }
}

export default isRefreshTokenValid;
