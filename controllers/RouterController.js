const User = require("../modle/customer");
const moment = require("moment");
exports.createUser = async (req, res) => {
  try {
    const users = await User.find({
         ...req.body,
          userId: req.session.user?.id
    });

    res.render("index", {
      arr: users,
      moment: moment,
      name: req.session.user?.name
    });
  } catch (err) {
    console.log(err);
     res.send(err.message);
  }
};

exports.Useredit =  async (req, res) => {
  await User.findById(req.params.id).then((user)=>{
   res.render("user/edit" , {user : user , name : req.session.user?.name});
  }).catch((err)=>{console.log(err)})
}
exports.app = async (req , res) => {await res.render("user/add" , {
  name: req.session.user?.name
})}
exports.authentication =  async(req, res) => {await res.render("authentication")};
exports.search =  async(req , res) => {await res.render("user/search")}




