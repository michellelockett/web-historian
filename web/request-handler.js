var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');

exports.handleRequest = function (req, res) {
  //var parsed = url.parse(req.url, true).pathname;

  var filePath = archive.paths.archivedSites + req.url;
  if (req.url == '/') {
    filePath = archive.paths.siteAssets + '/index.html';
  }

  if (req.method === 'GET') {

    fs.readFile(filePath, function(err, html) {
      if (err) {
        res.writeHead(404);
        res.end();
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(html, 'utf-8');
      }
    });
  }

  if (req.method === 'POST') {
    //append submitted site to sites.txt
    var body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });
    req.on('end', function() {
      var postData = qs.parse(body);
      console.log(postData.url);

      archive.addUrlToList(postData.url, function(err) {
        if (err) throw err;

        res.writeHead(302)
        res.end()
      });
    });
  }
};


