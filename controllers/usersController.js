const bcrypt = require("bcryptjs");
const usersModel = require("../model/usersModel");
module.exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const existingUser = await usersModel.findOne({ email });
    if (existingUser) {
      return res.send(
        `<script>alert("User already exists"); window.location.href = "/login";</script>`
      );
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new usersModel({
      email,
      password: hashedPassword,
    });
    await user.save();
    return res.json({ message: "Account Created.", redirect: "/login" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await usersModel.findOne({ email });
    console.log(email, password);

    if (!user) {
      return res.render("notfound");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (user && passwordMatch) {
      req.session.user = user;
      res.redirect("/profile");
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await usersModel.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

module.exports.getSingleUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await usersModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports.removeUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await usersModel.findByIdAndDelete({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user) {
      req.session.user = null;

      res.redirect("/login");
    }
  } catch (error) {
    next(error);
  }
};

// Update the route definition

// Update the controller
module.exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.userId; // Corrected parameter name
    const updatedUserData = req.body;
    const user = await usersModel.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user && userId) {
      req.session.user = user;
      res.redirect("/");
    }
  } catch (error) {
    next(error);
  }
};
