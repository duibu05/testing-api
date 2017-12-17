const controller = require('./controller');
const Router = require('express').Router;
const router = new Router();

router.route('/')
  .post((...args) => controller.create(...args))
  .get((...args) => controller.find(...args));

router.route('/:id')
  .put((...args) => controller.update(...args));

module.exports = router;
