module.exports = {
    linkChecker: function (link, visited, path) {
        /**
         * Check that the link target has not been visited
         * is not a meta page
         * is not from wiktionary.org
         * is a wiki page
         */
        var url = link.attr('href');
        var linkOk = visited.indexOf(url) === -1 &&
            url.indexOf('Help:') === -1 &&
            url.indexOf('File:') === -1 &&
            url.indexOf('Wikipedia:') === -1 &&
            url.indexOf('wiktionary.org/') === -1 &&
            url.indexOf('/wiki/') !== -1;

        if (linkOk) {
            /**
             * Check if the link is between parenthesis
             */
            var contentHtml = link.closest('p').length > 0 ? link.closest('p').html() : '';
            if (contentHtml !== '') {
                var linkHtml = 'href="' + url + '"';
                var contentBeforeLink = contentHtml.split(linkHtml)[0];
                var openParenthesisCount = contentBeforeLink.split('(').length - 1;
                var closeParenthesisCount = contentBeforeLink.split(')').length - 1;
                linkOk = openParenthesisCount <= closeParenthesisCount;
            }
        }

        if (linkOk) {
            // Check that the link is not in italic
            linkOk = link.parents('i').length === 0;
        }

        return linkOk;
    }
}