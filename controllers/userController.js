const bcrypt = require("bcrypt")
const Usermodel = require("../modle/UserModel")

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user =
  await Usermodel.findOne({email: email});
  if (!user) {
       return res.render("Login" , {
      error0 : "User not found"
    });
  }
  const isMatch = await bcrypt.compare(password , user.password);
if (!isMatch) {
    return res.render("Login" , {
      error : "Password incorrect"
    });
  }
    req.session.user = {
    id: user._id,
    name: user.name
  };

return res.redirect("/index");
}
