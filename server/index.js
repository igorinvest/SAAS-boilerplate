'use strict'
const uWS = require('uWebSockets.js');
const {config} = require('./src/config');
const {databaseService} = require('./src/models/db-entry');
const { assignRoutes } = require('./src/api/api-assign-routes');
const { loadStaticFolder } = require('./src/api/serve-static-dir');

let app = (config.useSSL) ? uWS.SSLApp({
    key_file_name: `${__dirname}/certificates/cloudflare.private.pem`,
    cert_file_name: `${__dirname}/certificates/cloudflare.certificate.pem`,
    passphrase: '1234'
}) : uWS.App();

//app.any('/api/*', apiRouter )
//.post('/fileUpload/*', uploadFile)
//app.any('/*', serveStatic, 604800 )

const start = async function () {
    try{
        await databaseService.startDatabase();
        //This function allows requests to only existing files that could be served. We don't check file existance for every request.
        await loadStaticFolder(config.productPath);
        //Create and start server
        app = assignRoutes(app);
        app.listen(config.port, (token) => {
            console.log('Listening to port ' + config.port, token);
        });
    } catch(e) {
        console.log('Error starting server', e);
    }
}
start();