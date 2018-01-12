// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

<<<<<<< HEAD
var archives = require('../helpers/archive-helpers');

archives.readListOfUrls().then(function(urls) {
=======
var archives = require('../helpers/archive-helpers')

archives.readListOfUrls(function(urls) {
>>>>>>> 9d97fdf075082e9f32bddf98e1b258427254b71d
  archives.downloadUrls(urls);
});


