/* ===========================================================================
let fs = require('fs');
let uuid = require('uuid/v4');
let os = require('os');
let path = require('path');

const { call: tar } = require('heroku-builds/lib/node_tar');


(() => {
    const filePath = path.join(os.tmpdir(), uuid() + '.tar.gz');

    console.log(filePath);
    
    // await tar();
})();

=========================================================================== */

const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const path = require('path');

const databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

const api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || '',
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',
  liveQuery: {
    classNames: ["Posts", "Comments"]
  }
});

const app = express();

app.use('/public', express.static(path.join(__dirname, '/public')));

const mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

const port       = process.env.PORT || 1337;
const httpServer = require('http').createServer(app);

httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

ParseServer.createLiveQueryServer(httpServer);
