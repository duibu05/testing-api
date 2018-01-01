const Facade = require('../../lib/facade');
const wechatSchema = require('./schema');

class WechatFacade extends Facade {}

module.exports = new WechatFacade('Wechat', wechatSchema);
