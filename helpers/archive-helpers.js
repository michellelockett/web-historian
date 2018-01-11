var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var https = require('https');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, function(err, data) {
    if (err) { throw err; }

    var splitData = data.toString().trim().split('\n');

    callback(splitData);
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(urls) {
    callback(urls.includes(url));
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', function(err) {
    callback();
  });
};

exports.isUrlArchived = (url, callback) => {
  fs.readdir(exports.paths.archivedSites, function(err, files) {
    callback(files.includes(url));
  });
};

exports.downloadUrls = function(urls) {
  if (urls[0] === '') { return; }
  
  for (var i = 0; i < urls.length; i++) {
    const currentUrl = urls[i];
    
    exports.isUrlArchived(currentUrl, function(isArchived) {

      var filepath = exports.paths.archivedSites + '/' + currentUrl;

      if (!isArchived) {
      
        var url = 'https://' + currentUrl;

        https.get(url, res => {
          let body = '';

          res.on('data', data => {
            body += data;
          });

          res.on('end', () => {
            fs.writeFile(filepath, body, function(err) {
              console.log('writing to: ', filepath);
              if (err) { throw err; }
            });
          });
        }).on('error', function(err) {
          console.log(err);
        });
      }
    });
  }

  fs.writeFile(exports.paths.list, '', function(err) {
    if (err) {
      console.log(err);
    }
  });
};
