'use strict';

var P = require('bluebird');
var logger = require('log4js').getLogger('github');
var phantomjs = require('../lib');

if(process.argv.length < 4){
    console.log('github.js [username] [password]');
    process.exit(1);
}
var user = process.argv[2], password = process.argv[3];

var main = P.coroutine(function*(){
    var phantom = yield phantomjs.create();
    var page = yield phantom.createPage();

    page.on('ConsoleMessage', function() {
        logger.info('onConsoleMessage %j', [].slice.call(arguments));
    });

    // page.on('LoadFinished', function() {
    //     console.log('onLoadFinished %j', [].slice.call(arguments));
    // });

    // page.on('ResourceReceived', function() {
    //     console.log("onResourceReceived %j", [].slice.call(arguments));
    // });

    // page.onResourceRequested(
    //     function(requestData, request, arg1, arg2) {
    //         request.abort(); // in phantomjs context
    //     },
    //     function(requestData) {
    //         logger.info(requestData.url)  // in nodejs context
    //     },
    //     'arg1', 'arg2'
    // );

    logger.info('open login page...');
    yield page.open('https://github.com/login');

    logger.info('input user/password and submit...');
    yield page.evaluate(function(user, password){
        // in phantomjs context
        console.log(user);
        document.querySelector('input[name=login]').value = user;
        document.querySelector('input[name=password]').value = password;
        document.querySelector('input[name=commit]').click();
    }, user, password);

    logger.info('wait for home page load...');
    yield page.waitFor('LoadFinished');

    var url = yield page.get('url');
    logger.info('done. loaded url: %s', url);

    yield page.render('github.png');
});

if (require.main === module) {
    main().finally(process.exit);
}

