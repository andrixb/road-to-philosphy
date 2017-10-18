const request = require('request');
const cheerio = require('cheerio');

const SELECTORS = {
    CONTAINER: '#mw-content-text > .mw-parser-output > p a:not(span a):not(sup a)'
};  
const FOUND = 'Philosophy';

function _linkChecker(url, visited) {
    let res;
    
    let linkOk = visited.indexOf(url) === -1 &&
    url.indexOf('Help:') === -1 &&
    url.indexOf('File:') === -1 &&
    url.indexOf('Wikipedia:') === -1 &&
    url.indexOf('wiktionary.org/') === -1 &&
    url.indexOf('/wiki/') !== -1;
    debugger;
    return res;
}

function _linkFinder(url, visited) {
    request(url, (error, response, body) => {
        if (error) {
            return error; 
        }
        const $ = cheerio.load(body);
        const content = $(SELECTORS.CONTAINER);

        if (content === 'undefined') {
            throw new Error('Content is undefined');
        } 
        const link = content[0].attribs.href;
        const title = content[0].attribs.title;
        visited.push(link);
       
        if(!_linkChecker(link, visited) && title !== FOUND) {
            _linkFinder(`https://en.wikipedia.org${link}`, visited);
        } else {
            console.log(visited.length);
        }
    });
}

module.exports = (url, visited) => {
    _linkFinder(url, visited);
};
