const Facade = require('../../lib/facade');
const wechatUserSchema = require('./schema');

class WechatUserFacade extends Facade {}

module.exports = new WechatUserFacade('WechatUser', wechatUserSchema);
