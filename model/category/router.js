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

router.route('/sub-category')
  .post((...args) => controller.findSubCategory(...args));

router.route('/paper')
  .post((...args) => controller.findPaper(...args));

router.route('/commit-wrong-paper')
  .post((...args) => controller.commitWrongPaper(...args));

router.route('/submit-wrong-question-answer')
  .post((...args) => controller.submitWrongQuestionUserAnswer(...args));

router.route('/wrong-paper-details')
  .post((...args) => controller.findWrongPaperDetails(...args));

router.route('/wrong-paper-list')
  .post((...args) => controller.findWrongPaper(...args));

router.route('/paper-details')
  .post((...args) => controller.findPaperDetails(...args));

router.route('/question-details')
  .post((...args) => controller.findQuestionDetails(...args));

router.route('/:id')
  .put((...args) => controller.update(...args))
  .get((...args) => controller.findById(...args))
  .delete((...args) => controller.remove(...args));

module.exports = router;
