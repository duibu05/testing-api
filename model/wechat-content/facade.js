const Facade = require('../../lib/facade');
const wechatContentSchema = require('./schema');

class WechatContentFacade extends Facade {}

module.exports = new WechatContentFacade('WechatContent', wechatContentSchema);
