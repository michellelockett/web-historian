var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');

exports.handleRequest = function (req, res) {
  var filePath = archive.paths.archivedSites + req.url;

  if (req.url === '/') {
    filePath = archive.paths.siteAssets + '/index.html';
  } else if (req.url === '/styles.css') {
    filePath = archive.paths.siteAssets + '/styles.css';
  } else if (req.url === '/loading') {
    filePath = archive.paths.siteAssets + '/loading.html';
  } else {
    filePath = archive.paths.archivedSites + '/' + req.url;
<<<<<<< HEAD
  }
=======
  } 
>>>>>>> 9d97fdf075082e9f32bddf98e1b258427254b71d

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
    var body = '';

    req.on('data', function(chunk) {
      body += chunk;
    });

    req.on('end', function() {
      var postData = qs.parse(body);
      var url = postData.url;
      var location = '/loading';
      console.log(postData);
<<<<<<< HEAD

      archive.isUrlArchived(url).then(function(isArchived) {

        if (isArchived) {
          location = url;
        } else {
          console.log('adding url to list')
          return archive.addUrlToList(url);
        }

            // archive.readListOfUrls(function(list) {
            //   console.log(list);
            // });
            // console.log('successful post');
      }).then(function() {
        res.writeHead(302, { 'Location': location });
        res.end();
      });
=======

      archive.isUrlArchived(url, function(isArchived) {
        if (isArchived) {
          location = url;
          res.writeHead(302, { 'Location': location });
          res.end();
        } else {
          archive.addUrlToList(url, function(err) {
            if (err) { throw err; }

            res.writeHead(302, { 'Location': location });
            res.end();

            archive.readListOfUrls(function(list) {
              console.log(list);
            });
            console.log('successful post');
          });
        }
      });     
>>>>>>> 9d97fdf075082e9f32bddf98e1b258427254b71d
    });
  }
};
