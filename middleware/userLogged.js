module.exports = (req, res, next) => {
  if (req.session?.user?.email) {
    next();
  } else {
    res.render("users/not-logged-in");
  }
};
