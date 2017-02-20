/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home', {
    path: 'home',
    title: 'Home'
  });
};
