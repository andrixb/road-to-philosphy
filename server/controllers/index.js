const request = require('request');
const cheerio = require('cheerio');

const observerService = require('../services/observe.service'); 

const _ = {
    CONTAINER: '#mw-content-text > .mw-parser-output > p a',
    // CONTAINER: '#mw-content-text > .mw-parser-output > p a:not(span a):not(sup a):not(.mw-redirect)',
    FOUND: 'Philosophy'
};  

let _nodes = new Array(0);
let _visited = new Array(0);
let _foundWords = new Array(0);
let _count = 0;

// function _linkChecker(url, visited) {

//     let linkOk = visited.indexOf(url) === -1 &&
//         url.indexOf('Help:') === -1 &&
//         url.indexOf('File:') === -1 &&
//         url.indexOf('Wikipedia:') === -1 &&
//         url.indexOf('Portal:') === -1 && 
//         url.indexOf('Special:') === -1 && 
//         url.indexOf('Template_talk:') === -1 &&  
//         url.indexOf('Template:') === -1 &&  
//         url.indexOf('Talk:') === -1 &&  
//         url.indexOf('Category:') === -1 &&   
//         url.indexOf('Bibcode:') === -1 &&   
//         url.indexOf('Main_Page:') === -1 &&   
//         url.indexOf('wiktionary.org/') === -1 &&
//         url.indexOf('/wiki/') !== -1;

//     if (linkOk) {
//         /**
//          * Check if the link is between parenthesis
//          */
//         let contentHtml = link.closest('p').length > 0 ? link.closest('p').html() : '';
//         if (contentHtml !== '') {
//             let linkHtml = 'href="' + url + '"';
//             let contentBeforeLink = contentHtml.split(linkHtml)[0];
//             let openParenthesisCount = contentBeforeLink.split('(').length - 1;
//             let closeParenthesisCount = contentBeforeLink.split(')').length - 1;
//             linkOk = openParenthesisCount <= closeParenthesisCount;
//             debugger;
//             console.log('here')
//         }
//     }

//     if (linkOk) {
//             // Check that the link is not in italic
//             linkOk = link.parents('i').length === 0;
//       }

//     return linkOk;
// }

function _linkSelector(ele, $) {
    let text;
    let href = ele.attribs.href;
    let article = href.split('/');
    
    let parenRegex = new RegExp(`\\((.*?${article}.*?)\\)`);
    let fromRegex = new RegExp(`${article}:`);
    let from2Regex = new RegExp(`from [A-Za-z\-\_]+: ${article}`);

    if (ele.parent !== 'undefined') {
        text = $(ele.parent).text();
    }
    
    article = article[article.length - 1];

    if ( _foundWords[article] ) { 
        return true; 
    }
    
	if ( href.match(/Wikipedia:/i) ) { 
        return true; 
    }		

	if ( href.match(/File:/i) ) { 
        return true; 
    }
			
	if ( href.indexOf('.') !== -1 ) { 
        return true;
    }
			
	if ( href.match(/#/) ) { 
        return true; 
    }

    if ( text.match(fromRegex) ) { 
        return true; 
    }

    if ( text.match(from2Regex) ) { 
        return true; 
    }

    if ( text.match(parenRegex) ) { 
        return true; 
    }

    _count++;
    
    return href;
}

function _linkFinder(url, visited) {
    request(url, (error, response, body) => {
        let link;
        const $ = cheerio.load(body);
        const content = $(_.CONTAINER);

        if (error) {
            return error; 
        }

        if (content === 'undefined') {
            throw new Error('Content is undefined');
        } 

        content.map(function (index, element) {
            link = _linkSelector(element, $);
            
            if (typeof link !==  'boolean') {
                _visited.push(link);
            }
        });

        if (_visited.length <= 0) {
			console.log("WARNING: this may be a disambiguation page. Trying anyways.");
			
			if ( $('#bodyContent .redirectMsg').length > 0) {
				_visited[0] = $('#bodyContent .redirectText > a').attribs.href;
			} else {
				_visited[0] = $('#bodyContent > ul li a:first').attribs.href;
				
				if ( _visited ) {
					return console.log("ERROR: could not find a suitable word, exiting.");
				}
			}
		}
		
		let article = _visited[0].split('/');
		article = article[article.length - 1];
        console.log("[" + _count + "] " + article);
        
        if (article.match(/philosophy/i)) {
			console.log("=======================================");
			console.log("It takes " + _count + " steps to get to " + article);
		} else {
			_foundWords[article] = true;
			_linkFinder(article);
		}
        
        
        // let link = content[0].attribs.href;
        // let title = content[0].attribs.title;

        // if (link === '/wiki/Reality') {
        //     link = content[1].attribs.href;
        //     title = content[1].attribs.title;
        // }

        // _visited.push(link);
        // _nodes.push({ link: link, title: title });

        // if (!_linkChecker(link, _visited) && title !== _.FOUND) {
        //     console.log(`loop ${link}`);
        //     _linkFinder(`https://en.wikipedia.org${link}`, _visited);
        // } else {
        //     if (title === _.FOUND) {
        //         observerService.calculated(_nodes);
        //         delete _nodes;
        //         delete _visited;
        //         return;
        //     } else {
        //         observeService.error(`The content of lst link was:\n ${link} \n and content was: \n ${content}`);
        //         return;
        //     }
        // }
    });
}

module.exports = (url) => {
    _linkFinder(url, _visited);
};
