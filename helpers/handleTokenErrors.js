function handleTokenErrors(req, res, err, tokenType) {
  const errorPayload = { purposeCompleted: false, errorReturned: err };

  if (err.name == "TokenExpiredError") {
    errorPayload.message = `-> the ${tokenType} provided has expired.`;
    res.status(403).json(errorPayload);
  }
  if (err.name == "JsonWebTokenError") {
    errorPayload.message = `-> the ${tokenType} provided is invalid or has been tampered with.`;

    res.status(401).json(errorPayload);
  }

  res.log.error(
    err,
    `-> an error has occured in the handleTokkenErrors function.`
  );
}

export default handleTokenErrors;
