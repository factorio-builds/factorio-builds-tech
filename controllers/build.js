const Promise = require('bluebird');
const mongoose = require('mongoose');
const Build = require('../models/Build');
const passport = require('passport');

Promise.promisifyAll(mongoose);

/**
 * GET /builds
 * Build list page.
 */
exports.getIndex = (req, res) => {
  Promise.props({
      title: 'Build',
      builds: Build.find().execAsync()
    })
    .then(function(results) {
      res.render('build/index', results);
    })
    .catch(function(err) {
      res.send(500);
    });
};

/**
 * GET /builds
 * Build single page.
 */
exports.getShow = (req, res) => {
  Promise.props({
      title: 'Build',
      build: Build.findOne({_id: req.params.id}).execAsync()
    })
    .then(function(results) {
      res.render('build/show', results);
    })
    .catch(function(err) {
      res.send(500);
    });
};

/**
 * GET /builds/create
 * Build create page.
 */
exports.getCreate = (req, res) => {
  res.render('build/form', {
    title: 'Create Build',
    categoryList: [
      { slug: 'balancers', name: 'Balancers' },
      { slug: 'layouts', name: 'Layouts' }
    ]
  });
};

/**
 * POST /builds/create
 * Build create page.
 */
exports.postCreate = (req, res, next) => {
  const build = new Build({
    name: req.body.name,
    desc: req.body.desc,
    category: req.body.category,
    createdBy: req.user._id,
    updatedBy: req.user._id,
    ownedBy: req.user._id
  });

  build.save((err) => {
    if (err) { return next(err); }
    req.flash('success', { msg: build.name + ' successfully created!' });
    res.redirect('/builds');
  });

  console.log(build);
  console.log(req.user);
};

/**
 * GET /builds/x/edit
 * Build edit page.
 */
exports.getEdit = (req, res) => {
  res.render('build/form', {
    title: 'Edit Build'
  });
};
