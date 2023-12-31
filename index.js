import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import serviceRoutes from "./routes/servicesRoutes.js";

import { logger, httpLogger } from "./logger.js";
import connectingToDb from "./config/db.js";
import setHeaders from "./config/headers.js";

import https from "https";
import fs from "fs";
import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

// making fileNames
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// enviorment variables
const PORT = process.env.PORT || 3001;

// initialising app
const app = express();

app.use(express.static(__dirname + "/public"));

// jargon
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// adding the logger
app.use(httpLogger);

// setting headers
app.use(setHeaders);

// connecting to the database
await connectingToDb();

// integrating cookie-parser
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));

// creating an HTTPS server
switch (process.env.NODE_ENV) {
  case "Dev-Local":
    const options = {
      key: fs.readFileSync("./ssl/cert.key"),
      cert: fs.readFileSync("./ssl/cert.crt"),
    };
    https.createServer(options, app).listen(PORT, () => {
      logger.info(`-> now listening at https://localhost:${PORT}/`);
    });
    break;
  case "Dev-Cloud":
    app.listen(PORT, () => {
      logger.info(`-> now listening at http://localhost:${PORT}/`);
    });
    break;
  case "Prod":
    // setting headers
    app.use(setHeaders);

    app.listen(PORT, () => {
      logger.info(`-> now listening at http://localhost:${PORT}/`);
    });
    break;
  default:
    console.error("Invalid NODE_ENV value");
    break;
}

// base URL
if (process.env.IF_VERCEL == "true") {
  app.get("/", (req, res) => {
    res.send("welcome to barGAt base.");
  });
}
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ...
app.use("/u", userRoutes);
app.use("/p", postRoutes);
app.use("/service", serviceRoutes);
