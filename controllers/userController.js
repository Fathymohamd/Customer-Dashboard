const bcrypt = require("bcrypt");
const Usermodel = require("../modle/UserModel");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render("Login", {
        error: "All fields are required"
      });
    }

    const user = await Usermodel.findOne({ email });

    if (!user) {
      return res.render("Login", {
        error: "User not found"
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
      name: user.name
    };

    return res.redirect("/index");

  } catch (err) {
  console.log("LOGIN ERROR FULL:", err);
  console.log(err.message);
  return res.status(500).send(err.message);
}
};