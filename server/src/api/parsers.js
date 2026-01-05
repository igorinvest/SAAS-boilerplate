const { Buffer } = require('buffer');
const querystring = require("querystring");
const ApiError = require('./api-error');
const uWS = require('uWebSockets.js')

var parseCookie = (str) => {
    str = str.split('; ');
    const result = {};
    for (let i in str) {
        const cur = str[i].split('=');
        result[cur[0]] = cur[1];
    }
    return result;
}
module.exports.parseCookie = parseCookie;

module.exports.parseBody = function parseBody(res) {
    return new Promise((resolve) => {
        let buffer
        res.onData((chunk, isLast) => {
            // copy the incoming ArrayBuffer to avoid shared/detached backing store
            const curBuf = Buffer.from(new Uint8Array(chunk));
            try {
                buffer = buffer ? Buffer.concat([buffer, curBuf]) : curBuf;
            } catch (e) {
                console.log('Buffer concat failed, falling back to replace buffer', e)
                // If concat fails for any reason, fallback to replace buffer (best-effort)
                buffer = curBuf;
            }
            if (isLast) {
                resolve(buffer);
                //console.log('resolved buffer', buffer)
            }
        })
    })
}

var parseResToBuffer = async (res) => {
    return new Promise((resolve) => {
        let bufferArray = [];
        res.onData((chunk, isLast) => {
            // ensure we copy the chunk into a non-shared Buffer immediately
            const curBuf = Buffer.from(new Uint8Array(chunk));
            bufferArray.push(curBuf);
            if (isLast) {
                let buffer;
                try {
                    buffer = Buffer.concat(bufferArray);
                } catch (e) {
                    console.log('Buffer concat failed, falling back to sequential copy', e)
                    // If concat fails, fall back to sequential copy
                    let totalLen = 0;
                    for (const b of bufferArray) totalLen += b.length;
                    buffer = Buffer.alloc(totalLen);
                    let offset = 0;
                    for (const b of bufferArray) {
                        b.copy(buffer, offset);
                        offset += b.length;
                    }
                }
                resolve(buffer);
                //console.log('resolved buffer', buffer)
            }
        })
    })
}
module.exports.parseResToBuffer = parseResToBuffer;

module.exports.parseBodyToObject = async function(res, contentType) {
    let body = null;

    const buffer = await parseResToBuffer(res);
    if(!buffer) {
        return;
    }
    
    if(contentType.includes('application/json')) {
        const str = buffer.toString();
        if(str) {
            body = JSON.parse(str);
        }
    } else if(contentType.includes('multipart/form-data')) {
        const parts = uWS.getParts(buffer, contentType)[0];
        if(!parts) {
            throw ApiError.BadRequest('Failed to parse form-data. Check content-type or smth.')
        }
        body = {};
        body.arrayBuffer = structuredClone(parts.data);
        body.name = structuredClone(parts.filename);
        body.type = structuredClone(parts.type);
    }

    return body;
}

module.exports.parseRequest = function parseRequest(req, route) {
    const contentType = req.getHeader('content-type')//.split(';')[0];
    const contentLength = Number(req.getHeader('content-length'))
    //const url = req.getUrl().split(route?.prefix)[1];

    let cookies;
    if(route.parseCookies) {
        cookies = parseCookie(req.getHeader('cookie'));
    }
    //console.log(route, cookies)
    
    let query;
    if(route.parseQuery) {
        query = querystring.parse(req.getQuery());
    }

    let accessToken;
    accessToken = req.getHeader('authorization').split(' ')[1];//bearer
    if(!accessToken && route.parseCookies) {
        accessToken = cookies?.accessToken;
    }
    //let user;
    //if(route.auth !== false) {
        //user = authService(accessToken);
    //}
    return {contentType, contentLength, cookies, query, accessToken};
}

module.exports.parseParams = function parseParams(route, parsedReq, parsedBody) {
    let params = [];
    for(let param of route.params) {
        let p;
        //console.log(p, param, cookies)
        if(param.source === 'cookies') {
            p = parsedReq.cookies[param.name] || null;
        } else if(param.source === 'query') {
            if(parsedReq.query) {
                p = parsedReq.query[param.name] || null;
            }
        } else if(param.source === 'bodyField' && parsedBody) {
            p = parsedBody[param.name] || null;
        } else if(param.source === 'body' && parsedBody) {
            p = parsedBody || null;
        } else if(param.source === 'userObject') {
            p = parsedReq.user;
        }

        if(param.validators) {
            for (let v of param.validators) {
                if(!v(p)) {
                    throw ApiError.BadRequest(`Invalid ${param.name}`)
                }
            }
        }
        //console.log(param, p)
        if(param.type === 'number') {
            p = Number(p);
        }
        params.push(p);
    }
    return params;
}


// module.exports.bbb = function(res) {
//     let buffer
//     res.onData((chunk, isLast) => {
//         console.log('received smth')
//         const curBuf = Buffer.from(chunk)
//         buffer = buffer ? Buffer.concat([buffer, curBuf]) : 
//             isLast ? curBuf : Buffer.concat([curBuf]);
//         if (isLast) {
//             console.log('got it', buffer)
//             return buffer;
//         }
//     })
//     console.log('how does it work')
// }
