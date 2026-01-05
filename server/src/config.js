const path = require('node:path');
require('dotenv').config()

module.exports.config = {
  landingProjectId: process.env.LANDING_PROJECT_ID,
  clientUrl: process.env.CLIENT_URL,
  baseHref: '',
  apiUrl: process.env.API_URL,
  port: Number(process.env.HTTP_PORT),
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  productPath: path.join(__dirname, '../../ui/dist/ui/browser'),
  productEntry: 'index.csr.html',
  modelSync: process.env.MODEL_SYNC,
  useSSL: (process.env.USE_SSL === 'true') ? true : false,
  useAws: (process.env.USE_AWS === "true") ? true : false,
  awsBucketName: process.env.AWS_S3_BUCKET,
  filesFolder: path.join(__dirname, '../files'),
  feedLimit: 50,
  fakeUserEmail: 'fake@email.com',
  logoName: 'logo.png',
  searchTimer: process.env.SEARCH_TIMER || 600000,
}
