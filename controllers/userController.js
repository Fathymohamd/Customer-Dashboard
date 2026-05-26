const bcrypt = require("bcrypt");
const Usermodel = require("../modle/UserModel");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;


if (!email || email.trim() === "") {
  return res.render("Login", {
    error0: "Email is required"
  });
}

if (!password || password.trim() === "") {
  return res.render("Login", {
    error: "Password is required"
  });
}

    const user = await Usermodel.findOne({ email });

    if (!user) {
      return res.render("Login", {
        error0: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render("Login", {
        error: "Password incorrect"
      });
    }

    req.session.user = {
      id: user._id,
      name: user.UserName || "Unknown"
    };
 
    req.session.save(() => {
  res.redirect("/index");
});
console.log("SESSION:", req.session);
console.log("USER:", req.session.user);
  } catch (err) {
  console.log("LOGIN ERROR FULL:", err);
  console.log(err.message);
  return res.status(500).send(err.message);
}
};