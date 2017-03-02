const Promise = require('bluebird');
const mongoose = require('mongoose');
const Build = require('../models/Build');
const Blueprint = require('../models/Blueprint');
const passport = require('passport');
const _ = require ('lodash');

const algoliasearch = require('algoliasearch');

const algolia = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
const index = algolia.initIndex('builds');

// Maybe this should be extracted to a model?
const categoryList = [
  { slug: 'balancers', name: 'Balancers' },
  { slug: 'smelting', name: 'Smelting' },
  { slug: 'trains', name: 'Trains' },
  { slug: 'production', name: 'Production' }
];

Promise.promisifyAll(mongoose);

/**
 * GET /builds
 * Build list page.
 */
exports.getIndex = (req, res) => {
  let query = {
    $or: [
      { draft: false },
      { draft: { $exists: false } }
    ]
  };

  Promise.props({
    path: 'builds',
    title: 'Builds',
    // allBuilds: Build
    //   .find(query)
    //   .execAsync(),
    builds: Build
      .find(query)
      .execAsync()
  })
  .then(function(results) {
    let groupSize = Math.floor(results.builds.length/3);
    results.builds = _.chunk(results.builds, groupSize);

    // _.each(results.allBuilds, function (build) {
    //   build.objectID = build._id;
    //   index.saveObject(build, function(err, content) {
    //     if(err) console.log(err);
    //   });
    // });

    res.render('build/index', results);
  })
  .catch(function(err) {
    res.send(500);
  });
};

/**
 * GET /my-builds
 * Build my-builds page.
 */
exports.getDrafts = (req, res) => {
  let query = {
    ownedBy: req.user._id
  };

  Promise.props({
    path: 'user',
    title: 'Builds',
    builds: Build
      .find(query)
      .sort('-draft')
      .sort('-created')
      .execAsync()
  })
  .then(function(results) {
    let groupSize = Math.floor(results.builds.length/3);
    results.builds = _.chunk(results.builds, groupSize);
    res.render('build/index', results);
  })
  .catch(function(err) {
    res.send(500);
  });
};

/**
 * GET /builds/type/x
 * Build list page by type.
 */
exports.getIndexByType = (req, res) => {
  let query = {
    category: req.params.type,
    $or: [
      { draft: false },
      { draft: { $exists: false } }
    ]
  };

  Promise.props({
    path: 'builds',
    title: 'Builds',
    type: req.params.type,
    category: _.find(categoryList, { slug: req.params.type }).name,
    builds: Build
      .find(query)
      .execAsync()
  })
  .then(function(results) {
    let groupSize = Math.ceil(results.builds.length/3);
    results.builds = _.chunk(results.builds, groupSize);
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
    path: 'builds',
    title: 'Builds',
    build: Build.findOne({_id: req.params.id}).execAsync(),
    blueprints: Blueprint.find({build: req.params.id}).execAsync()
  })
  .then(function(results) {
    // TODO: this can probably be written much more cleanly
    const userId = _.get(req, 'user._id') ? _.get(req, 'user._id').toString() : 0;

    if (results.build.draft && results.build.ownedBy.toString() !== userId) {
      delete results.build;
      results.cantSeeDraft = true;
    }

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
    path: 'builds',
    title: 'Builds',
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

  const blueprint = new Blueprint({
    name: req.body.name,
    order: 0,
    desc: null,
    hash: req.body.blueprint_hash,
    build: null // to be filled during the build save
  });

  if (req.file) {
    build.image = req.file.filename;
  }

  build.save((err) => {
    if (err) { return next(err); }

    // TODO: bulletproof this
    blueprint.build = build._id;
    blueprint.save((err) => {
      if (err) { return next(err); }
    });

    // saving the index to Algolia
    if (!build.draft) {
      index.addObject(build, build._id, (err, content) => {
        if(err) console.log(err);
      });
    }

    if (build.draft) {
      req.flash('info', { msg: build.name + ' was created as a draft.' });
      return res.redirect('/builds/' + build._id);
    }

    req.flash('success', { msg: build.name + ' successfully created!' });
    return res.redirect('/builds');
  });
};

/**
 * GET /builds/x/edit
 * Build edit page.
 */
exports.getEdit = (req, res) => {
  Promise.props({
    path: 'builds',
    title: 'Builds',
    categoryList: categoryList,
    build: Build.findOne({_id: req.params.id}).execAsync()
  })
  .then(function(results) {
    // TODO: this can probably be written much more cleanly
    const userId = _.get(req, 'user._id') ? _.get(req, 'user._id').toString() : 0;

    // Build doesn't belong to the user
    if (results.build.ownedBy.toString() != userId) {
      req.flash('errors', { msg: 'You aren\'t allowed to perform that action' });
      return res.redirect('/builds/' + results.build._id);
    }

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

    if (req.file) {
      build.image = req.file.filename;
    }

    build.save((err) => {
      if (err) { return next(err); }
      const message = build.name + ' was updated.';

      // TODO: this should be extracted
      Blueprint.findOne({ build: req.params.id }).then((err, blueprint) => {
        if (err) { return next(err); }

        if (blueprint) {
          blueprint.hash = req.body.blueprint_hash;

          blueprint.save((err) => {
            if (err) { return next(err); }
          });
        } else {
          const blueprint = new Blueprint({
            name: req.body.name,
            order: 0,
            desc: null,
            hash: req.body.blueprint_hash,
            build: build._id
          });

          blueprint.save((err) => {
            if (err) { return next(err); }
          });
        }
      });

      // saving the index to Algolia
      if (!build.draft) {
        build.objectID = build._id;
        index.saveObject(build, function(err, content) {
          if(err) console.log(err);
        });
      }

      // or remove it if it's a draft
      if (build.draft) {
        index.deleteObject(build._id, function(err, content) {
          if(err) console.log(err);
        });
      }

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
