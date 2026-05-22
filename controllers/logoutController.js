exports.logout = (req, res) => {

  req.session.destroy((err) => {

    if (err) {
      console.log(err);
      return res.redirect("/index");
    }
    res.redirect("/");
  });
};