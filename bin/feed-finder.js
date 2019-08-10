#! /usr/bin/env node
const args = process.argv.slice(2);
const input = args.filter(function (arg) {
    return arg.indexOf('-') != 0;
})[0];
const flags = args.filter(function (arg) {
    return arg.indexOf('--') == 0;
}).map(function (arg) {
    return arg.replace(/^\-\-/, '');
});

if (!input) {
    fail('Please provide url for searching feeds.');
}

const feedFinder = require('../');

const options = {};
if (flags.indexOf('no-www-switch') > -1) {
    options.noWWWSwitch = true;
}
if (flags.indexOf('no-guess') > -1) {
    options.noGuess = true;
}

feedFinder(input, options)
    .then(data => {
        console.log('Search results for "%s":', input);
        if (data.length)
            console.log('  - ' + data.join('\n  - '));
        else
            console.log('  No results!');
        process.exit(0);
    })
    .catch(err => {
        fail(err);
    });

function fail(msg) {
    console.error(msg);
    process.exit(1);
}
