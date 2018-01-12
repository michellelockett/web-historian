var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var dns = require('dns');

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

exports.readListOfUrls = function() {
  return new Promise(function(resolve, reject) {
    fs.readFile(exports.paths.list, function(err, data) {
      if (err) { return reject(err); }

      var splitData = data.toString().trim().split('\n');

      resolve(splitData);
    });
  });
};

exports.isUrlInList = function(url) {
  return new Promise(function(resolve, reject) {
    exports.readListOfUrls().then(function(urls) {
      resolve(urls.includes(url));
    });
  });
};

exports.addUrlToList = function(url) {
  return new Promise(function(resolve, reject) {
    fs.appendFile(exports.paths.list, url + '\n', function(err) {
      if (err) { return reject(err); }

      resolve();
    });
  });
};

exports.isUrlArchived = function(url) {
  return new Promise(function(resolve, reject) {
    fs.readdir(exports.paths.archivedSites, function(err, files) {
      if (err) { return reject(err); }

      resolve(files.includes(url));
    });
  });
};

exports.getIpAddress = function(url) {
  return new Promise(function(resolve, reject) {
    dns.lookup(url, function(err, address, family) {
      if (err) { return reject(err); }

      resolve(address);
    });
  });
};

exports.getService = function(ipAddress) {
  return new Promise(function(resolve, reject){
    dns.lookupService(ipAddress, 80, function(err, hostname, service) {
      if (err) { return reject(err); }

      resolve(service);
    });
  });
};

exports.fetchHtml = function(url) {
  return new Promise(function(resolve, reject){
    options = {
      host: url,
      port: 80,
      path: '/index.html',
    }

    http.get(options, res => {
      let body = '';

      res.on('data', data => {
        body += data;
      });

      res.on('end', () => {
        resolve(body);
      });
    }).on('error', function(err) {
      reject(err);
    });
  });
};

exports.downloadUrls = function(urls) {
  if (urls[0] === '') { return; }

  for (var i = 0; i < urls.length; i++) {
    const currentUrl = urls[i];

    exports.isUrlArchived(currentUrl).then(function(isArchived) {
      if (!isArchived) {
        var filepath = exports.paths.archivedSites + '/' + currentUrl;
        var url = currentUrl;

        exports.fetchHtml(url).then(function(body) {
          fs.writeFile(filepath, body, function(err) {
            console.log('writing to: ', filepath);
            if (err) { throw err; }
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
