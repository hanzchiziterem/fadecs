const { AuthenticationError } = require("apollo-server");

const jwt = require("jsonwebtoken");
const { secretKey } = require("../config");

module.exports = (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    //Bearer
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, secretKey);
        return user;
      } catch (err) {
        throw new AuthenticationError("Ínvalid/Expired Token");
      }
    }
    throw new Error("Authentication token must be 'Bearer [token]");
  }
  throw new Error("Authorization header must be provided");
};
