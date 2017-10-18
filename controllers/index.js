const request = require('request');
const cheerio = require('cheerio');

const SELECTORS = {
    CONTAINER: '#mw-content-text > .mw-parser-output > p a:not(span a)'
};  
const FOUND = 'Philosophy';

function _linkChecker(uri) {
    let res;

    return res;
}

function _linkFinder(url, visited) {
    request(url, (error, response, body) => {
        if (error) {
            return error; 
        }
        const $ = cheerio.load(body);
        const content = $(SELECTORS.CONTAINER);
        const link = content[0].attribs.href;
        const title = content[0].attribs.title;
        visited.push(link);

        if (title !== 'undefined' && title !== FOUND) {
            debugger;
            _linkFinder(`https://en.wikipedia.org${link}`, visited);
        } else {
            debugger;
            return;
        }   
    });
}

module.exports = (url, visited) => {
    _linkFinder(url, visited);
};
