const bcrypt = require("bcrypt");
const Usermodel = require("../modle/UserModel");

exports.signup = async (req, res) => {
  try {
    const { UserName , email, password } = req.body;
if (!UserName || UserName.trim() === "") {
  return res.render("Sinup", {
    error: "Name is required"
  });
}

if (!email || email.trim() === "") {
  return res.render("Sinup", {
    error0: "Email is required"
  });
}

if (!password || password.trim() === "") {
  return res.render("Sinup", {
    error2: "Password is required"
  });
}
    const user = await Usermodel.findOne({ email });
    if (user) {
      return res.render("Sinup", { error0: "Email already exists" });
    }
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!strongPassword.test(password)) {
      return res.render("Sinup", {
        error2: "Weak password"
      });
    }

  const hashPassword = await bcrypt.hash(password, 10);
const newUser = await Usermodel.create({
  UserName,
  email,
  password: hashPassword
});

    req.session.user = {
      id: newUser._id,
     name: newUser.UserName || "Unknown"
    };

    return res.redirect("/login");

  } catch (error) {
    console.log("SIGNUP ERROR:", error);
    return res.status(500).send("Server Error");
  }
};