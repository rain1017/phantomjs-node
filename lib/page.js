'use strict';

var P = require('bluebird');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Page = function(opts){
    EventEmitter.call(this);

    opts = opts || {};

    this._page = opts.page;

    var self = this;
    this.on('newListener', function(event, listener){
        self._page.set('on' + event, listener);
    });

    this.on('removeListener', function(event, listener){
        throw new Error('removeListener not supported');
    });
};

util.inherits(Page, EventEmitter);

var proto = Page.prototype;

proto.open =  function(url){
    var deferred = P.defer();
    this._page.open(url, function(status){
        if(status === 'success'){
            deferred.resolve();
        }
        else{
            deferred.reject(status);
        }
    });
    return deferred.promise;
};

proto.evaluate = function(fn){
    if(typeof(fn) !== 'function'){
        throw new Error('must pass a function');
    }
    var deferred = P.defer();

    var args = [fn, function(result){
        deferred.resolve(result);
    }];
    args = args.concat([].slice.call(arguments, 1));
    console.log('%j', args);
    this._page.evaluate.apply(this._page, args);

    return deferred.promise;
};

proto.set = function(path, value){
    return this._page.set(path, value);
};

proto.get = function(path){
    var deferred = P.defer();
    this._page.get(path, function(ret){
        deferred.resolve(ret);
    });
    return deferred.promise;
};

proto.render = function(url){
    var deferred = P.defer();
    this._page.render(url, function(){
        deferred.resolve();
    });
    return deferred.promise;
};

proto.onResourceRequested = function(){
    return this._page.onResourceRequested.apply(this._page, arguments);
};

module.exports = Page;
