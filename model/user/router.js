const controller = require('./controller');
const Router = require('express').Router;
const router = new Router();

router.route('/')
  .get((...args) => controller.find(...args))
  .post((...args) => controller.create(...args));

router.route('/check')
  .post((...args) => controller.check(...args));

router.route('/signin')
  .post((...args) => controller.signin(...args));

router.route('/signout')
  .post((...args) => controller.signout(...args));

router.route('/reset-password/:id')
  .put((...args) => controller.resetPwd(...args))

router.route('/token/:token')
  .get((...args) => controller.findOne(...args))

router.route('/:id')
  .put((...args) => controller.update(...args))
  .get((...args) => controller.findById(...args))
  .delete((...args) => controller.remove(...args));

module.exports = router;
