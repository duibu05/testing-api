const controller = require('./controller');
const Router = require('express').Router;
const router = new Router();

router.route('/')
  .post((...args) => controller.create(...args));

router.route('/update')
  .post((...args) => controller.updateSign(...args));

module.exports = router;
