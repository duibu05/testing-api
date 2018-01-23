const Controller = require('../../lib/controller');
const smsFacade = require('./facade');
const SMSClient = require('@alicloud/sms-sdk');

const config = require('../../config');
const accessKeyId = config.dayu.accessKeyId;
const secretAccessKey = config.dayu.secretAccessKey;

const smsClient = new SMSClient({ accessKeyId, secretAccessKey });

const codeArr = '0123456789'.split('');

const generateSMSCode = () => {
  let result = '';
  for (let i = 0; i < 6; i += 1) {
    result += codeArr[Math.floor(Math.random() * 10)];
  }
  return result;
};

const ERROR = new Error('验证码发送失败，请稍后重试！');

class SmsController extends Controller {
  sendSMS(req, res, next) {
    this.facade.remove({ phone: req.body.phone }).then(() => {
      const rcode = generateSMSCode();
      this.facade.create({
        phone: req.body.phone,
        code: rcode
      }).then((doc) => {
        if (doc) {
            // 发送短信
          smsClient.sendSMS({
            PhoneNumbers: req.body.phone,
            SignName: '考评网',
            TemplateCode: 'SMS_122595151',
            TemplateParam: `{"code":"${rcode}"}`
          }).then((result) => {
            const { Code } = result;
            if (Code === 'OK') {
            // 处理返回参数
              res.json({
                code: 0,
                msg: 'ok'
              });
            }
          }, () => {
            next(ERROR);
          });
        }
      }).catch(() => next(ERROR));
    }).catch(() => next(ERROR));
  }
}

module.exports = new SmsController(smsFacade);
