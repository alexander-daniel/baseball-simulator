'use strict';

function prepareDocument (opts) {

    var head  = opts.head || document.getElementsByTagName('head')[0];

    document.title = opts.title || 'habitants';

    var cssFiles = opts.css;

    cssFiles.forEach((file) => {
        var cssElement  = document.createElement('link');
        cssElement.rel  = file.rel || 'stylesheet';
        cssElement.type = file.type || 'text/css';
        cssElement.href = file.href;
        cssElement.media = file.media || 'all';
        head.appendChild(cssElement);
    });

    var faviconElement = document.createElement('link');

    faviconElement.type = opts.favicon.type || 'image/x-icon';
    faviconElement.rel = opts.favicon.rel || 'shortcut icon';
    faviconElement.href = opts.favicon.href;
    head.appendChild(faviconElement);


}

module.exports = prepareDocument;
