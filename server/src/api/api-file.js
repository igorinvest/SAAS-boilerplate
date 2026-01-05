const ApiError = require('./api-error');
const { responseHandler, assignAbortHandler} = require('./send-res');
const serveStaticFile = require('./serve-static2');
const { config } = require('../config')
const path = require('path');
const { staticFiles } = require('./serve-static-dir');

module.exports.downloadStaticFile = function (res, req) {
    assignAbortHandler(res);

    try {
        const url = req.getUrl();

        if(
            url.endsWith('.php') 
            || url.endsWith('.exe') 
            || url.endsWith('.sh')
            || url.endsWith('.jsp')
            || url.endsWith('.py')
            || url.includes('config')
            || url.includes('env') 
            || url.includes('security')
            || url.includes('access')
            || url.includes('sql')
            || url.includes('log')//passwd
            || url.includes('backup')
            || url.includes('src')
            || url.includes('credential') 
            || url.includes('passwd')
            || url.includes('git')
        ) {
            throw ApiError.BadRequest('We don’t take kindly to your types here!');
        }

        let folderPath = config.productPath;
        let fileName = '';
        const fn = url.substring(url.lastIndexOf('/') + 1);
        if (!fn || fn === '' || !fn.split('.')[1]) {
            fileName = config.productEntry;
        } else {
            fileName = url.replace('/app', '');
        }

        const filePath = path.join(folderPath, fileName);
        if(!filePath.startsWith(folderPath)) {
            throw ApiError.BadRequest('Ouch, you got me!');
        }

        const fileIndex = staticFiles.findIndex(f => f === filePath);
        if(fileIndex === -1) {
            console.log('Static file not found:', filePath);
            throw ApiError.BadRequest('File not found');
        }
        
        serveStaticFile(res, filePath);
    } catch (error) {
        res.cork(() => responseHandler.errorResponse(res, error));
    }
}
