const parser = require('./parser');
const spider = require('./spider');
const utils = require('./utils');

async function finder (inputUrl, options) {
    const urls = spider(inputUrl, options);
    const candidates = await Promise.all(urls.map(async url => {
        let result;
        try {
            result = await parser(url);
        } catch(e) {
            // do nothing
        }
        return result;
    }));
    const results = utils.flatten(candidates)
        .filter(utils.existent)
        .filter(utils.onlyUnique);
    return results;
}
module.exports = finder;
