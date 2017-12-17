const Controller = require('../../lib/controller');
const wechatUserFacade = require('./facade');

class WechatUserController extends Controller {}

module.exports = new WechatUserController(wechatUserFacade);
