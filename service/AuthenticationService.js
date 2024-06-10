const jwt = require("jsonwebtoken");

function getJwtSecret() {
  return "zwVoO7jJ27W0EQxURSqqXCP7XDs3By1kCL8DrPoqigQd1tk09GpRHUGRub4lBnAJzEzNW54NlMLTEX5uQ";
}

const authenticate = async function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;
    let decodedData;
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, getJwtSecret());
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub; 
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = { authenticate, getJwtSecret };
