/**
 * Builds routes.
 */

const buildController = require('../controllers/build');
const upload = require('../app').upload;

module.exports = (app) => {
  app.get('/builds', buildController.getIndex);
  app.get('/builds/type/:type', buildController.getIndexByType);
  app.get('/builds/new', buildController.getCreate);
  app.post('/builds/new', upload.single('photo'), buildController.postCreate);
  app.get('/builds/:id', buildController.getShow);
  app.get('/builds/:id/edit', buildController.getEdit);
  app.put('/builds/:id', upload.single('photo'), buildController.putUpdate);
  app.get('/builds/:id/publish', buildController.getPublish);
  app.get('/builds/:id/unpublish', buildController.getUnpublish);
}
