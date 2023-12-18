import jwt from "jsonwebtoken";

import {
  createUserAccessToken,
  createUserRefreshToken,
} from "../helpers/createTokens.js";
import createCookie from "../helpers/createCookie.js";
import handleTokenErrors from "../helpers/handleTokenErrors.js";

export async function refreshAccessToken(req, res) {
  try {
    const refreshTokenDecode = jwt.verify(
      req.signedCookies.userRefreshToken,
      process.env.JWT_REFRESH_SECRET_KEY
    );

    if (refreshTokenDecode) {
      const accessTokenDecode = jwt.verify(
        req.signedCookies.userAccessToken,
        process.env.JWT_ACCESS_SECRET_KEY,
        {
          ignoreExpiration: true,
        }
      );

      const userAccessTokenPayload = {
        id: accessTokenDecode.id,
        userName: accessTokenDecode.userName,
      };
      const userAccessToken = createUserAccessToken(userAccessTokenPayload);
      const userAccessCookieMaxAge = 1000 * 60 * 60 * 24 * 7 * 2;
      createCookie(
        req,
        res,
        "userAccessToken",
        userAccessToken,
        userAccessCookieMaxAge
      );

      const responsePayload = {
        purposeCompleted: true,
        message: `-> a new access token for user: ${accessTokenDecode.userName} has been sent.`,
      };

      res.log.info(
        responsePayload,
        "-> response payload for refreshAccessToken function"
      );
      res.status(200).json(responsePayload);
    } else {
      const responsePayload = {
        purposeCompleted: false,
        message: `-> refresh token is either not valid or expired.`,
      };

      res.log.info(
        responsePayload,
        "-> response payload for refreshAccessToken function"
      );
      res.status(403).json(responsePayload);
    }
  } catch (err) {
    //sending a response
    const errorPayload = {
      purposeCompleted: false,
      message: `-> an error has occured in creating a new the access token.`,
      accessTokenRefreshed: false,
    };

    res.log.error(
      err,
      "-> an error has occured in creating a new access token."
    );
    res.status(500).json(errorPayload);
  }
}

export async function refreshRefreshToken(req, res) {
  try {
    const refreshTokenDecode = jwt.verify(
      req.signedCookies.userRefreshToken,
      process.env.JWT_REFRESH_SECRET_KEY
    );

    if (refreshTokenDecode) {
      const userRefreshTokenPayload = {
        message: "-> I am a refresh token.",
      };

      const userRefreshToken = createUserRefreshToken(userRefreshTokenPayload);
      const userRefreshCookieMaxAge = 1000 * 60 * 60 * 24 * 7 * 4;
      createCookie(
        req,
        res,
        "userRefreshToken",
        userRefreshToken,
        userRefreshCookieMaxAge
      );

      const responsePayload = {
        purposeCompleted: true,
        message: `-> a new refresh token for user: ${refreshTokenDecode.userName} has been sent.`,
      };

      res.log.info(
        responsePayload,
        "-> response payload for refreshRefreshToken function"
      );
      res.status(200).json(responsePayload);
    } else {
      const responsePayload = {
        purposeCompleted: false,
        message: `-> refresh token is either not valid or expired.`,
      };

      res.log.info(
        responsePayload,
        "-> response payload for refreshAccessToken function"
      );
      res.status(403).json(responsePayload);
    }
  } catch (err) {
    //sending a response
    const errorPayload = {
      purposeCompleted: false,
      message: `-> an error has occured in creating a refresh token.`,
    };

    res.log.error(
      err,
      "-> an error has occured in creating a new refresh token."
    );
    res.status(500).json(errorPayload);
  }
}
