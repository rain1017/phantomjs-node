
if(typeof(phantom) === 'undefined'){
    throw new Error('should run in phantomjs');
}

var page = require('webpage').create();
var system = require('system');

if(system.args.length < 3){
    console.log('github.js [username] [password]');
    phantom.exit(1);
}

var user = system.args[1], password = system.args[2];


var printArgs = function(){
    console.log(JSON.stringify([].slice.call(arguments)));
};

var evaluate = function(page, func) {
    var args = [].slice.call(arguments, 2);
    var fn = "function() { return (" + func.toString() + ").apply(this, " + JSON.stringify(args) + ");}";
    return page.evaluate(fn);
}

page.open('https://github.com/login', function(status){
    if(status !== 'success'){
        console.log('open login page failed');
    }
    console.log('login page opened');

    evaluate(page, function(user, password){
        document.querySelector('input[name=login]').value = user;
        document.querySelector('input[name=password]').value = password;
        document.querySelector('input[name=commit]').click();
        console.log('login button clicked');
    }, user, password);
});

page.onInitialized = function() {
    console.log('page.onInitialized');
    printArgs.apply(this, arguments);
};

page.onLoadStarted = function() {
    console.log('page.onLoadStarted ' + page.url);
};

page.onLoadFinished = function() {
    console.log('page.onLoadFinished ' + page.url);
    page.render(page.url + '.png');
};

page.onUrlChanged = function(url) {
    console.log('page.onUrlChanged ' + url);
};

page.onNavigationRequested = function() {
    console.log('page.onNavigationRequested');
    printArgs.apply(this, arguments);
};

page.onClosing = function() {
    console.log('page.onClosing');
    printArgs.apply(this, arguments);
};

page.onConsoleMessage = function() {
    console.log('page.onConsoleMessage');
    printArgs.apply(this, arguments);
};

// page.onResourceRequested = function() {
//     console.log("page.onResourceRequested");
//     printArgs.apply(this, arguments);
// };

// page.onResourceReceived = function() {
//     console.log("page.onResourceReceived");
//     printArgs.apply(this, arguments);
// };
