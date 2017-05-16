const Promise = require('bluebird');
const mongoose = require('mongoose');
const Build = require('../models/Build');

const splitArrayIntoGroups = require('../helpers/array').splitArrayIntoGroups;

Promise.promisifyAll(mongoose);

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  const query = {
    $or: [
      { draft: false },
      { draft: { $exists: false } },
    ],
  };

  Promise.props({
    path: 'home',
    title: 'Home',
    builds: Build
      .find(query)
      .execAsync(),
  })
  .then((results) => {
    results.builds = splitArrayIntoGroups(results.builds, 3);

    res.render('home', results);
  })
  .catch((err) => {
    res.send(500);
  });
};
