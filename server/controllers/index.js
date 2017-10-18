const request = require('request');
const cheerio = require('cheerio');

const observerService = require('../services/observe.service'); 

const _ = {
    CONTAINER: '#mw-content-text > .mw-parser-output > p a:not(span a):not(sup a):not(.mw-redirect)',
    // CONTAINER: '#mw-content-text > .mw-parser-output > p a:not(span a):not(sup a):not(.mw-redirect)',
    FOUND: 'Philosophy'
};  

let _nodes = new Array(0);
let _visited = new Array(0);

function _linkChecker(url, visited) {

    let linkOk = visited.indexOf(url) === -1 &&
        url.indexOf('Help:') === -1 &&
        url.indexOf('File:') === -1 &&
        url.indexOf('Wikipedia:') === -1 &&
        url.indexOf('wiktionary.org/') === -1 &&
        url.indexOf('/wiki/') !== -1;

    if (linkOk) {
        /**
         * Check if the link is between parenthesis
         */
        let contentHtml = link.closest('p').length > 0 ? link.closest('p').html() : '';
        if (contentHtml !== '') {
            let linkHtml = 'href="' + url + '"';
            let contentBeforeLink = contentHtml.split(linkHtml)[0];
            let openParenthesisCount = contentBeforeLink.split('(').length - 1;
            let closeParenthesisCount = contentBeforeLink.split(')').length - 1;
            linkOk = openParenthesisCount <= closeParenthesisCount;
            console.log('here')
        }
    }

    if (linkOk) {
            // Check that the link is not in italic
            linkOk = link.parents('i').length === 0;
      }

    return linkOk;
}

function _linkFinder(url, visited) {
    request(url, (error, response, body) => {
        if (error) {
            return error; 
        }
        const $ = cheerio.load(body);
        const content = $(_.CONTAINER);

        if (content === 'undefined') {
            throw new Error('Content is undefined');
        } 
        
        let link = content[0].attribs.href;
        let title = content[0].attribs.title;

        if (link === '/wiki/Reality') {
            link = content[1].attribs.href;
            title = content[1].attribs.title;
        }

        _visited.push(link);
        _nodes.push({ link: link, title: title });

        if (!_linkChecker(link, _visited) && title !== _.FOUND) {
            console.log(`loop ${link}`);
            _linkFinder(`https://en.wikipedia.org${link}`, _visited);
        } else {
            if (title === _.FOUND) {
                observerService.calculated(_nodes);
                delete _nodes;
                delete _visited;
                return;
            } else {
                observeService.error(`The content of lst link was:\n ${link} \n and content was: \n ${content}`);
                return;
            }
        }
    });
}

module.exports = (url) => {
    _linkFinder(url, _visited);
};
