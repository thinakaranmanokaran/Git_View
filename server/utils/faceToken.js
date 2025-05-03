const jwt = require('jsonwebtoken');

const sendFaceToken = (user, statusCode, res) => {
  // Create the payload with all user data
  const payload = {
    email: user.email,
    face: "registered"
  };

  // Generate the token
  const faceToken = jwt.sign(payload, process.env.JWT_SECRET || "defaultSecretKey", { expiresIn: '30d' });

  // Send the response
  res.status(statusCode).json({
    success: true,
    faceToken,
    data: payload,
  });
};

module.exports = sendFaceToken;
