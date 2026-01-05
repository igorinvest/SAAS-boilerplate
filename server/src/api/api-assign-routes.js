const ApiError = require('./api-error');
const {routes} = require('./api-routes');
const { responseHandler, assignAbortHandler } = require('./send-res');
const {parseRequest, parseBodyToObject, parseParams} = require("./parsers");
const { downloadStaticFile } = require("./api-file");
const { userAccessService } = require('../modules/user/user-access-service');

module.exports.assignRoutes = function(app) {
    //Take all JSON routes and assign them to server
    for (const route in routes) {
        //Get route params
        const routeParams = routes[route];
        Object.freeze(routeParams);//I don't know if it's actually needed, just checking;
        //Assign GET and POST
        if(routeParams.method === 'GET') {
            app.get("/api" + route, async (res, req) => {
                assignAbortHandler(res);

                try {
                    const parsedRequest = parseRequest(req, routeParams);
                    const accessToken = parsedRequest.accessToken;
                    parsedRequest.user = userAccessService.checkRouteAccess(routeParams, accessToken);
                    const params = parseParams(routeParams, parsedRequest, undefined);
                    if(route.auth !== false) {
                        console.log('User for route', route, parsedRequest?.user?.userId);
                    }
                    const result = await routeParams.service[routeParams.function](...params);
                    if(result === undefined) {
                        throw ApiError.ServerError('Failed to process request');
                    }
                    if (res.aborted) {
                        return;
                    }
                    res.cork(() => responseHandler.processResult(res, result, routeParams));
                } catch (error) {
                    if(res.aborted) {
                        return;
                    }
                    res.cork(() => {
                        responseHandler.errorResponse(res, error);
                    })
                }
            })
        } else if(routeParams.method === 'POST') {
            app.post("/api" + route, async (res, req) => {
                assignAbortHandler(res);

                try {
                    const parsedRequest = parseRequest(req, routeParams);
                    const accessToken = parsedRequest.accessToken;
                    parsedRequest.user = userAccessService.checkRouteAccess(routeParams, accessToken);
                    const parsedBody = await parseBodyToObject(res, parsedRequest.contentType);
                    const params = parseParams(routeParams, parsedRequest, parsedBody);
                    if (route.auth !== false) {
                        console.log('User for route', route, parsedRequest?.user?.userId);
                    }
                    const result = await routeParams.service[routeParams.function](...params);
                    if(result === undefined) {
                        throw ApiError.ServerError('Failed to process request');
                    }
                    if (res.aborted) {
                        return;
                    }
                    res.cork(() => responseHandler.processResult(res, result, routeParams));
                } catch (error) {
                    if(res.aborted) {
                        return;
                    }
                    res.cork(() => {
                        responseHandler.errorResponse(res, error);
                    })
                }
            })
        }
    }
    app.get('/*', downloadStaticFile )
    app.options('/*', (res) => {
        responseHandler.successResponse(res);
    })
    return app;
};


