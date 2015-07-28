'use strict';

var P = require('bluebird');
var phantomNode = require('phantom');
var PhantomJS = require('./phantomjs');

exports.create = function(){
    var deferred = P.defer();
    var args = [].slice.call(arguments);
    args.push(function(_phantom){
        var phantom = new PhantomJS({phantom : _phantom});
        deferred.resolve(phantom);
    });

    phantomNode.create.apply(phantomNode, args);
    return deferred.promise;
};
