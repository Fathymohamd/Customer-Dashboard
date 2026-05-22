const bcrypt = require("bcrypt")
const Usermodel = require("../modle/UserModel")

exports.signup =  async (req, res) => {
  try {
    const { UserName, email, password } = req.body;

    if (!UserName) {
      return res.render("Sinup", {
        error: "Please enter a valid UserName."
      });
    }
      if (!email) {
      return res.render("Sinup", {
        error0: "Please enter a valid Email."
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.render("Sinup", {
        error1: "Invalid email"
      });
    }


const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
if (!strongPassword.test(password)) {
  return res.render("Sinup", {
    error2:
    "Password must contain uppercase, lowercase, number, special character and be at least 8 characters long."
  });
}
    const user = await Usermodel.findOne({ email });

    if (user) {
      return res.render("Sinup", {
        error3: "Email already exists"
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
const newUser = await Usermodel.create({
  name: UserName,
  email: email,
  password: hashPassword,
});

    req.session.user = {
    id: newUser._id,
    name: newUser.name
  };

    return res.redirect("/Login");
  } catch (error) {
    console.log(error);
    return res.render("Sinup", {
    });
  }
};