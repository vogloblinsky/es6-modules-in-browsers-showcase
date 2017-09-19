const express = require('express'),
      fs = require('fs'),
      zlib = require('zlib'),
      path = require('path'),
      spdy = require('spdy'),
      http = require('http'),

      app = express(),

      URLS = {
          'legacy': '/index-legacy.html',
          'bundled': '/index-bundled.html',
          'unbundled': '/index-unbundled.html',
          'unbundled-push': '/index-unbundled-push'
      };

let cache = {};

app.set('etag', false)

app.use(express.static('src'));

(function() {
    //Cache JS assets
    cache['index-unbundled-push.html'] = zlib.gzipSync(fs.readFileSync(path.join(__dirname, 'src', 'index-unbundled.html')));
    cache['todoapp.css'] = zlib.gzipSync(fs.readFileSync(path.join(__dirname, 'src', 'styles/todoapp.css')));
    cache['app.css'] = zlib.gzipSync(fs.readFileSync(path.join(__dirname, 'src', 'styles/app.css')));
    cache['main.js'] = zlib.gzipSync(fs.readFileSync(path.join(__dirname, 'src', 'main.js')));

    cache['app.js'] = zlib.gzipSync(fs.readFileSync(path.join(__dirname, 'src', 'scripts/app.js')));
    cache['controller.js'] = zlib.gzipSync(fs.readFileSync(path.join(__dirname, 'src', 'scripts/controller.js')));
    cache['helpers.js'] = zlib.gzipSync(fs.readFileSync(path.join(__dirname, 'src', 'scripts/helpers.js')));
    cache['model.js'] = zlib.gzipSync(fs.readFileSync(path.join(__dirname, 'src', 'scripts/model.js')));
    cache['store.js'] = zlib.gzipSync(fs.readFileSync(path.join(__dirname, 'src', 'scripts/store.js')));
    cache['template.js'] = zlib.gzipSync(fs.readFileSync(path.join(__dirname, 'src', 'scripts/template.js')));
    cache['todo.js'] = zlib.gzipSync(fs.readFileSync(path.join(__dirname, 'src', 'scripts/todo.js')));
    cache['view.js'] = zlib.gzipSync(fs.readFileSync(path.join(__dirname, 'src', 'scripts/view.js')));
})();

app.get('/index-unbundled-push', (req, res) => {
  Promise.all([
      zlib.gzipSync(fs.readFileSync(path.join(__dirname, 'src', 'index-unbundled.html'))),
      zlib.gzipSync(fs.readFileSync(path.join(__dirname, 'src', 'scripts/app.js')))
      ]).then(files => {

            if (res.push){
                console.log('push');
                var jsfile = res.push('/scripts/app.js', {
                    status: 200,
                    method: 'GET',
                    request: {
                      accept: '*/*'
                    },
                    response: {
                      'content-type': 'application/javascript',
                      'content-encoding': 'gzip',
                      'vary': 'Accept-Encoding'
                    }
                });

                jsfile.on('error', err => {
                    console.log(err);
                });

                jsfile.end(files[1]);
            }

            res.writeHead(200, {
              'content-type': 'text/html',
              'content-encoding' : 'gzip',
              'vary': 'Accept-Encoding'
            });
            res.end(files[0]);
      }).catch(error => res.status(500).send(error.toString()));
});

http.createServer(app).listen(3000, () => {
    return console.log(`HTTP/1
Use http://localhost:3000${URLS.legacy} for legacy version
Use http://localhost:3000${URLS.bundled} for bundled version
Use http://localhost:3000${URLS.unbundled} for unbundled version`);
});

function _onRequest(request, response) {
    let url = request.url;
    console.log(`HTTP server: request for ${request.url}`);

    if (url === '/index-unbundled-push') {
        response.writeHead(200, {
          'content-type': url.endsWith('.js') ? 'application/javascript' : 'text/html',
          'content-encoding' : 'gzip',
          'vary': 'Accept-Encoding'
        });
        response.end(cache['index-unbundled-push.html'])
    } else if (url === '/styles/todoapp.css') {
      response.writeHead(200, {
        'content-type': 'text/css',
        'content-encoding' : 'gzip',
        'vary': 'Accept-Encoding'
      });
      response.end(cache['todoapp.css'])
    } else if (url === '/styles/app.css') {
      response.writeHead(200, {
        'content-type': 'text/css',
        'content-encoding' : 'gzip',
        'vary': 'Accept-Encoding'
      });
      response.end(cache['app.css'])
    } else if (url === '/main.js') {
      response.writeHead(200, {
        'content-type': 'application/javascript',
        'content-encoding' : 'gzip',
        'vary': 'Accept-Encoding'
      });
      response.end(cache['main.js'])
    } else if (url.indexOf('/scripts') !== -1) {
      let fileName = url.replace('/scripts/', '');
      if (response.push){
          console.log('push');
          console.log(fileName, url);
          const pushed = response.push(url, {
            status: 200,
            method: 'GET',
            request: {
              accept: '*/*'
            },
            response: {
              'content-type': 'application/javascript',
              'content-encoding': 'gzip',
              'vary': 'Accept-Encoding'
            }
          });
          pushed.on('error', err => console.log('HTTP server: push error ', err));
          pushed.end(cache[fileName]);
      }
      response.writeHead(200, {
        'content-type': 'application/javascript',
        'content-encoding' : 'gzip',
        'vary': 'Accept-Encoding'
      });
      response.end(cache[fileName]);
    } else {
      response.writeHead(404);
      response.end();
    }
}

spdy.createServer({
    key: fs.readFileSync(path.join(__dirname, 'keys/server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'keys/server.crt')),
    spdy: { protocols: ['h2', 'http/1.1', 'http/1.0'] }
}, app).listen(3001, (err) => {
    if (err) {
        throw new Error(err);
    }
    console.log(`
HTTP/2
Use https://localhost:3001${URLS.legacy} for legacy version
Use https://localhost:3001${URLS.bundled} for bundled version
Use https://localhost:3001${URLS.unbundled} for unbundled version`);
})
