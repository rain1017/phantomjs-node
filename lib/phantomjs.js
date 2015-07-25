'use strict';

var P = require('bluebird');
var Page = require('./page');

var PhantomJS = function(opts){
    opts = opts || {};
    this._phantom = opts.phantom;
};

var proto = PhantomJS.prototype;

proto.createPage = function(){
    var deferred = P.defer();
    this._phantom.createPage(function(page){
        deferred.resolve(new Page({
            page : page,
        }));
    });
    return deferred.promise;
};

module.exports = PhantomJS;
