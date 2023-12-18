async function setHeaders(req, res, next) {
  const allowedOrigin = "https://bargat.vercel.app";
  const origin = req.headers.origin;
  if (origin !== allowedOrigin && process.env.NODE_ENV == "Production") {
    res.status(403).send("Origin not allowed");
  } else {
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "https://bargat.vercel.app");
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );
    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }
    next();
  }
}

export default setHeaders;