const jwt = require("jsonwebtoken");

const generateToken = (id, model) => {
  return jwt.sign({ id, model }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const sendTokenResponse = (user, statusCode, res, model) => {
  const token = generateToken(user._id, model);

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  // Add role property based on model type
  const userData = user.toObject();
  if (model === "BloodBank") {
    userData.role = "bloodbank";
  } else if (model === "Organization") {
    userData.role = "organization";
  } else if (model === "User") {
    // Check if user is admin
    userData.role = userData.role || "user";
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user: userData,
  });
};

module.exports = { generateToken, sendTokenResponse };
