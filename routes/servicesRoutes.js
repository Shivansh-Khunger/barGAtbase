import * as servicesController from "../services/servicesControllers.js";

import express from "express";
const router = express.Router();

router.get("/renewAccess", servicesController.refreshAccessToken);

export default router;
