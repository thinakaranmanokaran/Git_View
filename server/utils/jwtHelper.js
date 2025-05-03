const jwt = require('jsonwebtoken');

const sendToken = (user, statusCode, res) => {
  // Create the payload with all user data
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
    phoneNo: user.phoneNo,
    collegeName: user.collegeName,
    collegeAddress: user.collegeAddress,
    degree: user.degree,
    department: user.department,
    role: user.role,
  };


  // Generate the token
  const token = jwt.sign(payload, process.env.JWT_SECRET || "defaultSecretKey", { expiresIn: '30d' });

  // Send the response
  res.status(statusCode).json({
    success: true,
    token,
    data: payload,
  });
};

module.exports = sendToken;
