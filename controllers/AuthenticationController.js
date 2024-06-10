const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const AuthenticationService = require("../service/AuthenticationService");

const login = async (request, response) => {
  try {
    const { email, password } = request.body;
    if (email && password) {
      const user = await User.findOne({ email });
      if (!user) {
        return response.status(400).json({
          errorType: "no-user-found",
          errorMessage: "Det gick inte att hitta en användare med det användarnamnet",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return response.status(400).json({
          errorType: "incorrect-password",
          errorMessage: "Felaktigt lösenord",
        });
      }

      const token = jwt.sign(
        { uid: user.email },
        AuthenticationService.getJwtSecret(),
        { expiresIn: '30d' }
      );
      return response.status(200).json({
        success: true,
        message: "Authentication successful!",
        tid: token,
        uid: user.email,
        user: user,
        firstName: user.firstname,
        lastName: user.lastname,
        _userId: user._id,
        role: user.role,
      });
    } else {
      return response.status(400).json({
        errorType: "unknown-error",
        errorMessage: "Felaktigt användarnamn eller lösenord",
      });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

const register = async (req, res) => {
  try {
    const { email, password, firstname, lastname } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      password: hashedPassword,
      firstname,
      lastname,
      role: "user",
    });
    await newUser.save();

    const token = jwt.sign(
      { uid: newUser.email },
      AuthenticationService.getJwtSecret(),
      { expiresIn: '30d' }
    );
    return res.status(200).json({
      success: true,
      message: "Authentication successful!",
      tid: token,
      uid: newUser.email,
      user: newUser,
      firstName: newUser.firstname,
      lastName: newUser.lastname,
      _userId: newUser._id,
      role: newUser.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to register user" });
  }
};

module.exports = { login, register };
