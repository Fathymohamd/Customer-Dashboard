const bcrypt = require("bcrypt");
const Usermodel = require("../modle/UserModel");

exports.signup = async (req, res) => {
  try {
    const { UserName, email, password } = req.body;

    if (!UserName || !email || !password) {
      return res.render("Sinup", { error: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.render("Sinup", { error: "Invalid email" });
    }

    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!strongPassword.test(password)) {
      return res.render("Sinup", {
        error: "Weak password"
      });
    }

    const user = await Usermodel.findOne({ email });

    if (user) {
      return res.render("Sinup", { error: "Email already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await Usermodel.create({
      name: UserName,
      email,
      password: hashPassword
    });

    req.session.user = {
      id: newUser._id,
      name: newUser.name
    };

    return res.redirect("/login");

  } catch (error) {
    console.log("SIGNUP ERROR:", error);
    return res.status(500).send("Server Error");
  }
};