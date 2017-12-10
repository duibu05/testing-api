const Controller = require('../../lib/controller');
const wechatContentFacade = require('./facade');

class WechatContentController extends Controller {}

module.exports = new WechatContentController(wechatContentFacade);
