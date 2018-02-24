const controller = require('./controller');
const Router = require('express').Router;
const router = new Router();

router.route('/')
  .post((...args) => controller.find(...args));

router.route('/details')
  .post((...args) => controller.findById(...args));

module.exports = router;
