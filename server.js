const express = require('express'),
      fs = require('fs'),
      path = require('path'),
      spdy = require('spdy'),
      http = require('http'),

      app = express(),

      URLS = {
          'legacy': '/index-legacy.html',
          'bundled': '/index-bundled.html',
          'unbundled': '/index-unbundled.html'
      }

app.set('etag', false)

app.use('/', express.static(path.join(__dirname, 'src'), {
    maxAge: 1000 * 1000 * 1000,
    etag: false
}))

http.createServer(app).listen(3000, () => {
    return console.log(`HTTP/1
Use http://localhost:3000${URLS.legacy} for legacy version
Use http://localhost:3000${URLS.bundled} for bundled version
Use http://localhost:3000${URLS.unbundled} for unbundled version`);
})

spdy.createServer({
    key: fs.readFileSync(path.join(__dirname, 'keys/server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'keys/server.crt'))
}, app).listen(3001, () => {
    return console.log(`
HTTP/2
Use https://localhost:3001${URLS.legacy} for legacy version
Use https://localhost:3001${URLS.bundled} for bundled version
Use https://localhost:3001${URLS.unbundled} for unbundled version`);
})
