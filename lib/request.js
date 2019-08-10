var got = require('got');
var pkg = require('../package.json');

async function request (url) {
    return got(url, {
        timeout: 10000,
        retries: 2,
        headers: {
            'user-agent': pkg.name + '/' + pkg.version + ' (' +  pkg.homepage + ')'
        }
    });
}

module.exports = request;
