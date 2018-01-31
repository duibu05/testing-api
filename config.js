const config = {
  environment: process.env.NODE_ENV || 'dev',
  server: {
    port: process.env.PORT || 3000
  },
  mongo: {
    url: process.env.MONGO_DB_URI || 'mongodb://localhost/testing-api'
  },
  qiniu: {
    access_key: process.env.QINIU_KEY || 'key',
    secret_key: process.env.QINIU_SECRET || 'secret',
    bucket: 'kaoping',
    host:'http://upload-na0.qiniu.com/'
  },
  dayu: {
    accessKeyId: process.env.ACCESS_KEY_ID || 'appid',
    secretAccessKey: process.env.SECRET_ACCESS_KEY || 'secret'
  },
  mapp: {
    secret: process.env.MAPP_SECRET || '',
    mappid: process.env.MAPP_ID || ''
  }
};

module.exports = config;
