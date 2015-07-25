'use strict';

var P = require('bluebird');
var phantomNode = require('phantom');
var PhantomJS = require('./phantomjs');

exports.create = function(){
    var deferred = P.defer();
    var args = [
        function(_phantom){
            var phantom = new PhantomJS({phantom : _phantom});
            deferred.resolve(phantom);
        }
    ];
    args.concat([].slice.call(arguments));
    phantomNode.create.apply(phantomNode, args);
    return deferred.promise;
};
