import user from "../../model/user.js";

import bcrypt from "bcrypt";

import {
  createUserRefreshToken,
  createUserAccessToken,
} from "../../helpers/createTokens.js";

import createCookie from "../../helpers/createCookie.js";

export async function userExists(req, res) {
  try {
    // checking if userExists
    const ifUserExists = await user.exists({ _id: req.triggerUserId });

    if (ifUserExists) {
      return res.status(200).json({
        purposeCompleted: true,
        message: `-> user with the userName: ${req.body.userName} already exists`,
        ifUserExists: ifUserExists,
      });
    } else {
      return res.status(200).json({
        purposeCompleted: true,
        message: `-> user with the userName: ${req.body.userName} does not exists`,
        ifUserExists: ifUserExists,
      });
    }
  } catch (err) {
    const errorPayload = {
      purposeCompleted: false,
      message: `-> an error has occured while checking if the user: ${req.body.userName} exists.`,
      errorOccured: true,
    };

    res.log.error(err, "-> an error has occured in the userExists function");

    return res.status(500).json(errorPayload);
  }
}

export async function userLogin(req, res) {
  try {
    // getting the triggerUser
    const triggerUser = await user.findOne(
      { userName: req.params.userName },
      { userName: true, userPassword: true }
    );

    // checking if provided passsword is correct
    const receivedPassword = String(req.body.password);
    const isPasswordCorrect = await bcrypt.compare(
      receivedPassword,
      triggerUser.userPassword
    );

    if (isPasswordCorrect) {
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
      res.status(200).json({
        purposeCompleted: true,
        message: "user has been logged in",
      });
    } else {
      res.status(401).json({
        purposeCompleted: false,
        message: "password is incorrect",
        passwordInccorect: true,
      });
    }
  } catch (err) {
    const errorPayload = {
      purposeCompleted: false,
      message: `-> an error has occured while comparing credentials for user: ${req.body.userName}.`,
      errorOccured: true,
    };

    res.log.error(err, "-> an error has occured in the userLogin function");
    return res.status(500).json(errorPayload);
  }
}
