'use strict';

var P = require('bluebird');
var phantomjs = require('../lib');

if(process.argv.length < 4){
    console.log('github.js [username] [password]');
    process.exit(1);
}
var user = process.argv[2], password = process.argv[3];

var main = P.coroutine(function*(){
    var phantom = yield phantomjs.create();
    var page = yield phantom.createPage();

    page.on('LoadFinished', P.coroutine(function*(){
        console.log('page.onLoadFinished %j', arguments);

        var url = yield page.get('url');
        console.log(url);
        yield page.render('github.png');
    }));

    page.on('UrlChanged', function() {
        console.log('page.onUrlChanged %j', arguments);
    });
    page.on('ConsoleMessage', function() {
        console.log('page.onConsoleMessage %j', arguments);
    });
    // page.on('ResourceReceived', function() {
    //     console.log("page.onResourceReceived %j", arguments);
    // });

    // page.onResourceRequested(
    //     function(requestData, request, arg1, arg2) {
    //         request.abort(); // in phantomjs context
    //     },
    //     function(requestData) {
    //         console.log(requestData.url)  // in nodejs context
    //     },
    //     'arg1', 'arg2'
    // );

    yield page.open('https://github.com/login');

    yield page.evaluate(function(user, password){
        // in phantomjs context
        console.log(user);
        document.querySelector('input[name=login]').value = user;
        document.querySelector('input[name=password]').value = password;
        document.querySelector('input[name=commit]').click();
    }, user, password);
});

if (require.main === module) {
    main();
}

