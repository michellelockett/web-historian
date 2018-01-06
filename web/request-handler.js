var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var fs = require('fs');

exports.handleRequest = function (req, res) {
  var parsed = url.parse(req.url, true).pathname;
  console.log(parsed);

  if (req.method === 'GET') {
    var indexPath = archive.paths.siteAssets + '/index.html';

    fs.readFile(indexPath, function(err, html) {
      if (err) {
        console.log(err);
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(html, 'utf-8');
      }
    });
  }
};
