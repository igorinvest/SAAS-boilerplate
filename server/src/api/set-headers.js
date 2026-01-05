const {config} = require('../config')

module.exports = new class SetHeaders{

  writeCors(res) {
    if(res?.aborted) {
      console.log(`Res is aborted or not passed ${res}`);
      return res;
    }
    if(config.clientUrl) {
      res.writeHeader("Access-Control-Allow-Origin", config.clientUrl);
    }
    res.writeHeader("Content-Type", "application/json");
    res.writeHeader("Access-Control-Allow-Credentials", "true");
    res.writeHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.writeHeader("Access-Control-Allow-Headers", "authorization, origin, content-type, accept, x-requested-with");
    res.writeHeader("Access-Control-Max-Age", "306000");
    //res.writeHeader("X-Frame-Options", "DENY");
    res.writeHeader("X-Frame-Options", "default-src, img-src *");
    res.writeHeader("Permissions-Policy", "identity-credentials-get");
    res.writeHeader('X-Xss-Protection', '1; mode=block');
    res.writeHeader('X-Content-Type-Options', 'nosniff');
    //res.writeHeader("Referrer-Policy", "no-referrer-when-downgrade");
    res.writeHeader('Referrer-Policy', 'no-referrer');
    res.writeHeader('Content-Security-Policy', 'upgrade-insecure-requests');
    return res;
  }

  writeConentType(res) {
    if(res?.aborted) {
      console.log(`Res is aborted or not passed ${res}`);
      return res;
    }
    res.writeHeader("Content-Type", "application/json");
    return res;
  }

  setRefreshToken(res, refreshToken, days) {
    if(!res || res?.aborted) {
      console.log(`Res is aborted or not passed ${res}`);
      return res;
    }
    let expires = "";
    let date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
    const cookie = 'refreshToken' + "=" + (refreshToken || "")  + expires + "; HttpOnly; path=/api/refresh";
    res.writeHeader('Set-Cookie', cookie);
    return res;
  }

  setAccessToken(res, accessToken, minutes) {
    if(!res || res?.aborted) {
      console.log(`Res is aborted or not passed ${res}`);
      return res;
    }
    let expires = "";
    let date = new Date();
    date.setTime(date.getTime() + (minutes*60*1000));
    expires = "; expires=" + date.toUTCString();
    const cookie = 'accessToken' + "=" + (accessToken || "")  + expires + "; HttpOnly; path=/api/downloadFile";
    res.writeHeader('Set-Cookie', cookie);
    return res;
  }

  setEncoding(res) {
    if(!res || res?.aborted) {
      console.log(`Res is aborted or not passed ${res}`);
      return res;
    }
    //res.writeHeader("Content-Encoding", 'gzip');
    //res.writeHeader("Content-Encoding", 'deflate');
    //res.writeHeader("Transfer-Encoding", 'chunked');
    //res.writeHeader("Transfer-Encoding", 'deflate');
    res.writeHeader("Transfer-Encoding", 'gzip');
    return res;
  }
}



