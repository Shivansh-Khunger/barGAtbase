import user from "../../model/user.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

    return res.status(500).json();
  }
}

export async function userLogin(req, res) {
  try {
    // getting the triggerUser
    const triggerUser = await user.findOne(
      { _id: req.triggerUserId },
      { userName: true, userPassword: true }
    );

    // checking if provided passsword is correct
    const receivedPassword = String(req.body.password);
    const isPasswordCorrect = await bcrypt.compare(
      receivedPassword,
      triggerUser.userPassword
    );

    if (isPasswordCorrect) {
      const payload = { id: triggerUser.id, userName: triggerUser.userName };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRATION,
      });
      res.status(200).json({
        purposeCompleted: true,
        message: "user has been logged in",
        token,
      });
    } else {
      res.status(401).json({
        purposeCompleted: false,
        message: "password is incorrect",
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
