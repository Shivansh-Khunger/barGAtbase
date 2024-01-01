import * as userController from "../controllers/userControllers.js";

// middlewares
import imageUpload from "../middlewares/imageUpload.js";
import ifTokenIsValid from "../middlewares/tokenVerify.js";
import isRefreshTokenValid from "../middlewares/refreshTokenCheck.js";
import ifUserExists from "../middlewares/userExists.js";

import express from "express";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post(
  "/new",
  upload.single("picture"),
  imageUpload,
  userController.newUser
);
router.post("/newNoImg", userController.newUserNoImg);

router.use(isRefreshTokenValid, ifTokenIsValid, ifUserExists);

router.delete("/del", userController.deleteUser);
router.put("/update-userBio", userController.updateUserBio);
router.put("/update-userName", userController.updateUserName);
router.put(
  "/update-userDisplayPicture",
  upload.single("picture"),
  imageUpload,
  userController.updateUserDisplayPicture
);
router.put("/toggle-following/:targetUserName", userController.toogleFollowing);

// in Works
router.get("/:userName/check-password", userController.checkPass);
router.get("/:userName/login", userController.userLogin);

router.get("/lsd", userController.checkToken);

export default router;
