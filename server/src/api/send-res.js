const {writeCors, setRefreshToken, setAccessToken} = require('./set-headers');
const logger = require('../logger');
const ApiError = require('./api-error');

module.exports.assignAbortHandler = function(res) {
    // Pre-register abort handler to avoid calling res.* after abort
    if (typeof res.onAborted === 'function') {
        if (typeof res.aborted === 'undefined') res.aborted = false;
        res.onAborted(() => {
            res.aborted = true;
        });
    }
};

module.exports.responseHandler = new class SendRes{

    errorResponse(res, error) {
        logger(error.message);
    
        let e = {}, status;
        if (error instanceof ApiError) {
            e.message = error.message;
            e.errors = error.errors;
            status = error.status.toString();
        } else {
            e.message = 'Unknown server error';
            status = '500 Internal server error';
        }
        this.sendRes(res, status, e);
    }

    successResponse(res, data) {
        this.sendRes(res, '200 OK', data);
    }
    
    //should be private
    sendRes(res, status, data) {
        //console.log('sending result')
        if(!res || res?.aborted) {
            console.log(`Res is aborted or not passed ${res?.aborted}`);
            return;
        }
        if(status && typeof status === 'string') {
            res.writeStatus(status);
        } else {
            //console.log('status', status, new Date());
            res.writeStatus('500');
        }
        writeCors(res);
        res.end(JSON.stringify(data || {}));
        //console.log(res, status, data);
    }

    processResult(res, result, route) {
        const refreshToken = result?.refreshToken;
        if(route.setRefreshToken && refreshToken) {
            setRefreshToken(res, refreshToken, 30);
            delete result['refreshToken'];
        } else if(route.removeRefreshToken) {
            setRefreshToken(res, refreshToken, 0);
        }

        const accessToken = result?.accessToken;
        if(route.setAccessToken && accessToken) {
            setAccessToken(res, accessToken, 10);
        } else if(route.removeAccessToken) {
            setAccessToken(res, accessToken, 0);
        }
        this.successResponse(res, result);
        // if(route.serveFile) {
        //     //pipeStreamOverResponse(res, result.fileStream, result.size, result.type);
        // } else {
        //     this.successResponse(res, result);
        // }
    }
}


