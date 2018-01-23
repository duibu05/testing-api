const config = {
  environment: process.env.NODE_ENV || 'dev',
  server: {
    port: process.env.PORT || 3000
  },
  mongo: {
    url: process.env.MONGO_DB_URI || 'mongodb://localhost/testing-api'
  },
  qiniu: {
    access_key: 'YE6Jmx-R-Cl0UJZKgJ_osSHeXCpOtk4IjFGMySwg',
    secret_key: 'ApFdSvLu75ICUPYjS8dQkovVSWAuXah6mp_jEQBi',
    bucket: 'kaoping',
    host:'http://upload-na0.qiniu.com/'
  },
  dayu: {
    accessKeyId: process.env.ACCESS_KEY_ID || 'LTAI14yEWN5IPXLy',
    secretAccessKey: process.env.SECRET_ACCESS_KEY || 'hhhhhhhhh'
  }
};

module.exports = config;
