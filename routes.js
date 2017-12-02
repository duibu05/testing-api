const Router = require('express').Router;
const router = new Router();

const user = require('./model/user/router');
const qiniuToken = require('./model/qiniu-uptoken/router');

router.route('/api').get((req, res) => {
  res.json({ message: 'Welcome to testing-api API!' });
});

router.use('/api/users?', user);
router.use('/api/qiniu-uptokens?', qiniuToken);

module.exports = router;

