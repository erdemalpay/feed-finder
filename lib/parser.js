const htmlparser = require('htmlparser2');
const path = require('path');
const url = require('url');

const request = require('./request');

const contentTypes = [
    'application/x.atom+xml',
    'application/atom+xml',
    'application/xml',
    'text/xml',
    'application/rss+xml',
    'application/rdf+xml'
];

async function parser(url) {
    const response = await request(url);
    const base = null;

    // strip content-type extra info like 'text/xml; charset=utf-8'
    const header = (response.headers['content-type'] || '').split(';')[0];
    if (inc(contentTypes, header)) {
        return url;
    }

    const rv = [];

    const parser = new htmlparser.Parser({
        onopentag: function onOpenTag(name, attrs) {
            let feed;

            if (name.toLowerCase() == 'base' && (attrs.href || attrs.HREF)) {
                base = (attrs.href || attrs.HREF);
                return;
            }

            if (feed = isFeedLink(url, base, name, attrs)) {
                return rv.push(feed);
            }

            if (feed = isPossiblyFeed(url, base, name, attrs)) {
                rv.push(feed);
            }
        },
    });

    parser.parseComplete(data);
}

function isFeedLink (originUrl, base, tagName, attrs) {
    tagName = tagName.toLowerCase();
    const href = attrs.href || attrs.HREF;
    const type = attrs.type || attrs.TYPE;

    if (tagName == 'link' && inc(contentTypes, type)) {
        return url.resolve(originUrl, base ? path.join(base, href) : href);
    }
}

function isPossiblyFeed (originUrl, base, tagName, attrs) {
    tagName = tagName.toLowerCase();
    const feedLike = /(\.(rdf|xml|rss)$|feed=(rss|atom)|(atom|feed|rss)\/?$)/i;
    const blacklist = /(add\.my\.yahoo|\.wp\.com\/|\?redir(ect)?=)/i;

    const href = attrs.href || attrs.HREF;

    if (inc(['a', 'link'], tagName) && feedLike.test(href) && !blacklist.test(href)) {
        return url.resolve(originUrl, base ? path.join(base, href) : href);
    }
}

function inc (arr, val) {
    return arr.indexOf(val) > -1;
}

module.exports = parser;
