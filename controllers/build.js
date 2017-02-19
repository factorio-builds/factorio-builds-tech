const Promise = require('bluebird');
const mongoose = require('mongoose');
const Build = require('../models/Build');
const passport = require('passport');

const categoryList = [
  { slug: 'balancers', name: 'Balancers' },
  { slug: 'layouts', name: 'Layouts' }
];

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
    categoryList: categoryList
  });
};

/**
 * POST /builds/create
 * Build create page.
 */
exports.postCreate = (req, res, next) => {
  const build = new Build({
    name: req.body.name,
    draft: req.body.draft,
    desc: req.body.desc,
    category: req.body.category,
    createdBy: req.user._id,
    updatedBy: req.user._id,
    ownedBy: req.user._id
  });

  build.save((err) => {
    if (err) { return next(err); }
    if (build.draft) {
      req.flash('info', { msg: build.name + ' was created as a draft.' });
      return res.redirect('/builds/' + build._id);
    }

    req.flash('success', { msg: build.name + ' successfully created!' });
    return res.redirect('/builds');
  });

  console.log(build);
  console.log(req.user);
};

/**
 * GET /builds/x/edit
 * Build edit page.
 */
exports.getEdit = (req, res) => {
  Promise.props({
    title: 'Edit Build',
    categoryList: categoryList,
    build: Build.findOne({_id: req.params.id}).execAsync()
  })
  .then(function(results) {
    res.render('build/form', results);
  })
  .catch(function(err) {
    res.send(500);
  });
};

/**
 * PUT /builds/x
 * Update a build.
 */
exports.putUpdate = (req, res) => {
  Build.findOne({ _id: req.params.id }, (err, build) => {
    if (err) { return next(err); }

    // Build doesn't belong to the user
    if (build.ownedBy.toString() != req.user._id.toString()) {
      req.flash('errors', { msg: 'You aren\'t allowed to perform that action' });
      return res.redirect('back');
    }

    build.name = req.body.name;
    build.category = req.body.category;
    build.desc = req.body.desc;
    build.updatedBy = req.user._id;

    build.save((err) => {
      if (err) { return next(err); }
      const message = build.name + ' was updated.';
      req.flash('success', { msg: message });
      return res.redirect('/builds/' + build._id);
    });
  });
};

/**
 * Helper method to publish and unpublish.
 */
function publishPublish(req, res, publish) {
  Build.findOne({ _id: req.params.id }, (err, build) => {
    if (err) { return next(err); }

    // Build doesn't belong to the user
    if (build.ownedBy.toString() != req.user._id.toString()) {
      req.flash('errors', { msg: 'You aren\'t allowed to perform that action' });
      return res.redirect('back');
    }

    build.draft = !publish;

    build.save((err) => {
      if (err) { return next(err); }
      const message = build.name + (publish ? ' is now published.' : ' is now a draft.');
      req.flash('success', { msg: message });
      return res.redirect('/builds/' + build._id);
    });
  });
}

/**
 * GET /builds/x/publish
 * Publish a build.
 */
exports.getPublish = (req, res) => {
  publishPublish(req, res, true);
};

/**
 * GET /builds/x/unpublish
 * Publish a build.
 */
exports.getUnpublish = (req, res) => {
  publishPublish(req, res, false);
};
