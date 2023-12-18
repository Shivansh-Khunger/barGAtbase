function createCookie(req, res, field, fieldValue, maxAge) {
  res.cookie(field, fieldValue, {
    secure: true,
    httpOnly: true,
    signed: true,
    maxAge: maxAge,
  });
}

export default createCookie;
