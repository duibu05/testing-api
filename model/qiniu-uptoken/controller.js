const QINIU_CONF = require('../../config').qiniu,
      qiniu = require("qiniu");


//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = QINIU_CONF.access_key;
qiniu.conf.SECRET_KEY = QINIU_CONF.secret_key;

//构建上传策略函数
function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(QINIU_CONF.bucken);
  return putPolicy.token();
}


exports.uptoken = function(req, res) {
  token = uptoken(BUCKET);

  res.json({ token: token });
};

