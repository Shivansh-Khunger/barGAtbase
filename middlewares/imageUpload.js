import axios from "axios";
import { logger } from "../logger.js";

async function imageUpload(req, res, next) {
  try {
    const uploadedFile = req.file;
    const base64 = Buffer.from(uploadedFile.buffer).toString("base64");
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      {
        image: base64,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const responseData = response.data;
    req.imageUploadedData = responseData.data;

    logger.info("-> the image has been successfully uploaded.");
    next();
  } catch (error) {
    const errorPayload = {
      purposeCompleted: true,
      errorOccured: true,
    };

    res.log.error(err, "-> an error has occured in imageUpload function.");
    res.status(500).json(errorPayload);
  }
}

export default imageUpload;
