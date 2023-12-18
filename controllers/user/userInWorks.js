// A file for all the functions which are in works or are not intended to be used

import user from "../../model/user.js";
import bcrypt from "bcrypt";
import jwt, { decode } from "jsonwebtoken";

import { logger } from "../../logger.js";

export async function checkPass(req, res) {
  const triggerUser = await user.findOne(
    {
      userName: req.triggerUserName,
    },
    { userPassword: true }
  );

  await bcrypt
    .compare(req.body.password, triggerUser.userPassword)
    .then((result) => {
      if (result) {
        res.send("This User is authenticated");
      } else {
        res.send("This is user has entered wrong password");
      }
    });
}

// export async function checkToken(req, res) {
//   const verify = jwt.verify(req.body.token, process.env.JWT_SECRET_KEY, {
//     complete: true,
//   });
//   console.log(verify);
//   res.send(verify);
// }

export async function checkToken(req, res) {
  logger.info(req.signedCookies, "-> signed cookies are");

  if (req.signedCookies.userToken) {
    try {
      const refreshDecode = jwt.verify(
        req.signedCookies.userToken,
        process.env.JWT_SECRET_KEY,
        {
          // complete: true,
        }
      );
    } catch (err) {
      if (err.name == `TokenExpiredError`) {
        logger.error(err);
      }
    }
  }
}
