// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

var archives = require('../helpers/archive-helpers');

archives.readListOfUrls().then(function(urls) {
  archives.downloadUrls(urls);
});


