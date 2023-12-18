import user from "../model/user.js";

async function ifUserExists(userName) {
  const ifUserExists = await user.findOne(
    { userName: userName },
    { _id: true }
  );

  if (ifUserExists) {
    return true;
  }
  return false;
}

export default ifUserExists;
