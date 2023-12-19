import * as postController from "../controllers/postControllers.js";

import imageUpload from "../middlewares/imageUpload.js";
import ifTokenIsValid from "../middlewares/tokenVerify.js";
import isRefreshTokenValid from "../middlewares/refreshTokenCheck.js";
import ifUserExists from "../middlewares/userExists.js";

import express from "express";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.use(isRefreshTokenValid, ifTokenIsValid, ifUserExists);

router.post(
  "/new",
  upload.single("picture"),
  imageUpload,
  postController.newPost
);

router.delete("/:id/del", postController.deletePost);
router.get("/all", postController.getAllPosts);
router.get("/:id", postController.getPost);
router.put("/:id/toggle-like", postController.toggleLikeToPost);
router.put("/:id/update-caption", postController.updatePostCaption);
router.put(
  "/:id/update-picture",
  upload.single("picture"),
  imageUpload,
  postController.updatePostImage
);
// router.put(
//   "/v/new",
//   upload.single("video"),
//   postController.newVideoPost
// );
// router.get("/v/:id", postController.getVideoPost);
router.post("/:id/c/new", postController.newComment);
router.put("/c/:id/toggle-like", postController.toggleLikeToComment);
router.delete("/c/:id/del", postController.deleteComment);

export default router;
