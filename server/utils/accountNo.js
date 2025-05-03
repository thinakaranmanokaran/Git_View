const jwt = require('jsonwebtoken');

const sendAccNo = (user, statusCode, res) => {
  // Create the payload with all user data
  const payload = {
    email: user.email,
    accountno: user.accountno,
    balance: user.balance,
  };

  // Generate the token
  const accountToken = jwt.sign(payload, process.env.JWT_SECRET || "defaultSecretKey", { expiresIn: '30d' });

  // Send the response
  res.status(statusCode).json({
    success: true,
    accountToken,
    data: payload,
  });
};

module.exports = sendAccNo;
