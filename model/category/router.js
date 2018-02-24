const controller = require('./controller');
const Router = require('express').Router;
const router = new Router();

router.route('/')
  .get((...args) => controller.find(...args))
  .post((...args) => controller.create(...args));

router.route('/rebuild')
  .get((...args) => controller.findByTypeAndRebuildDate(...args));

router.route('/subject')
  .post((...args) => controller.findSubject(...args));

router.route('/category')
  .post((...args) => controller.findCategory(...args));

router.route('/paper')
  .post((...args) => controller.findPaper(...args));

router.route('/paper-details')
  .post((...args) => controller.findPaperDetails(...args));

router.route('/question-details')
  .post((...args) => controller.findQuestionDetails(...args));

router.route('/:id')
  .put((...args) => controller.update(...args))
  .get((...args) => controller.findById(...args))
  .delete((...args) => controller.remove(...args));

module.exports = router;
