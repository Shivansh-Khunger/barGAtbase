import jwt from "jsonwebtoken";

export function createUserAccessToken(payload) {
  const userAccessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION,
  });

  return userAccessToken;
}

export function createUserRefreshToken(payload) {
  const userRefreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET_KEY,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    }
  );

  return userRefreshToken;
}
