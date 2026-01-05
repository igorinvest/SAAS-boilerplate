const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const ApiError = require('./api-error');
const { config } = require('../config');

/* Minimal cleanup helper */
function finishResponse(res, stream) {
    try { stream?.destroy(); } catch (e) { console.log(e) }
    try { res.id = -1; } catch (e) { console.log(e) }
}

/* Defensive tryEnd wrapper: uWS may return boolean or [ok, done] */
function callTryEnd(res, ab, size) {
    try {
        const result = res.tryEnd(ab, size);
        if (Array.isArray(result)) return { ok: result[0], done: result[1] };
        return { ok: !!result, done: !!result };
    } catch (e) {
        console.log(e)
        return { ok: false, done: false };
    }
}

/* Serve a static file over uWebSockets low-level streaming API.
   Usage: serveStatic(res, '/absolute/path/to/file') */
const serveStaticFile = function (res, filePath) {
    if (!res || !filePath) {
        throw ApiError.BadRequest("File doesn't exist");
    }

    // Stat the file first
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.cork(() => {
                // Best-effort: avoid calling uWS methods if aborted
                if (!res.aborted && typeof res.writeStatus === 'function') {
                    res.writeStatus('404 Not Found');
                }
                if (!res.aborted && typeof res.end === 'function') {
                    try { res.end('Not found'); } catch (e) { console.log(e) }
                }
            });
            return;
        }

        const totalSize = stats.size;
        const contentType = mime.contentType(path.extname(filePath)) || 'application/octet-stream';
        const isImage = contentType.startsWith('image/');
        //I hope this cork wrapper is legal
        res.cork(() => {
            // Set headers if available
            if (!res.aborted && typeof res.writeHeader === 'function') {
                res.writeHeader('Content-Type', contentType);
                res.writeHeader('Content-Length', String(totalSize));
                res.writeHeader('Cache-Control', 'public, max-age=31536000, immutable');
                res.writeHeader('X-Xss-Protection', '1; mode=block');
                res.writeHeader('X-Content-Type-Options', 'nosniff');
                res.writeHeader('Referrer-Policy', 'no-referrer');
                res.writeHeader('Content-Security-Policy', 'upgrade-insecure-requests');
                if (isImage) {
                    res.writeHeader('Access-Control-Allow-Origin', '*');
                } else {
                    res.writeHeader("Access-Control-Allow-Origin", config.clientUrl);
                }
            } else if (!res.aborted && typeof res.writeStatus === 'function') {
                // fall back to minimal status header
                res.writeStatus('200 OK');
            }
        })

        const stream = fs.createReadStream(filePath);
        //let savedOffset = 0;

        // Ensure cleanup if client aborts or stream errors
        function cleanup() {
            finishResponse(res, stream);
        }

        if (typeof res.onAborted === 'function') {
            // already set aborted flag above; additionally ensure stream destroyed on abort
            res.onAborted(() => cleanup());
        }

        stream.on('data', (chunk) => {
            if (res.aborted) {
                cleanup();
                return;
            }

            const ab = chunk.buffer.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength);

            // getWriteOffset may throw if aborted; guard it
            let lastOffset = 0;
            try { lastOffset = res.getWriteOffset(); } catch (e) {
                if (res.aborted) { cleanup(); return; }
                throw e;
            }

            res.cork(() => {
                if (res.aborted) return;

                const { ok, done } = callTryEnd(res, ab, totalSize);

                if (done) {
                    cleanup();
                } else if (!ok) {
                    // backpressure: pause stream and save remaining chunk
                    stream.pause();
                    res.ab = ab;
                    res.abOffset = lastOffset;

                    // onWritable should be registered once per backpressure event
                    res.onWritable((offset) => {
                        if (res.aborted) {
                            // return true so uWS considers this handler done
                            return true;
                        }
                        const start = offset - res.abOffset;
                        const remaining = res.ab.slice(Math.max(0, start));
                        const { ok: ok2, done: done2 } = callTryEnd(res, remaining, totalSize);

                        if (done2) {
                            cleanup();
                        } else if (ok2) {
                            stream.resume();
                        }
                        return ok2;
                    });
                }
            });
        });

        stream.on('end', () => {
            // stream end handled by tryEnd(done) path; ensure cleanup if not already
            cleanup();
        });

        stream.on('error', (e) => {
            console.log(e)
            // Don't call res methods if aborted
            if (res.aborted) {
                cleanup();
                return;
            }
            // Best-effort close
            try { if (typeof res.writeStatus === 'function') res.writeStatus('500 Internal Server Error'); } catch (e) { console.log(e) }
            try { if (typeof res.end === 'function') res.end('Internal error'); } catch (e) { console.log(e) }
            cleanup();
        });
    });
};

module.exports = serveStaticFile;