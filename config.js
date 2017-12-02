const config = {
  environment: process.env.NODE_ENV || 'dev',
  server: {
    port: process.env.PORT || 3000
  },
  mongo: {
    url: process.env.MONGO_DB_URI || 'mongodb://localhost/testing-api'
  },
  qiniu: {
    access_key: 'LAZ4C4DTVBYf4gQsGcHXvxLS-2_-jFQ-tdfgzbKL',
    secret_key: 'X1aPSj693RB7HVWO_Tl8vsypk3GWb3SBEwYkcnUq',
    bucket: 'ccf-china-public',
    host:'http://upload-na0.qiniu.com/'
  },
};

module.exports = config;
