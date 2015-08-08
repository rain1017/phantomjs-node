'use strict';

var P = require('bluebird');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Page = function(opts){
    EventEmitter.call(this);
    opts = opts || {};

    this._page = opts.page;
    this._registerEvents();
};

util.inherits(Page, EventEmitter);

var proto = Page.prototype;

proto._registerEvents = function(){
    var events = [
        'Initialized', 'LoadStarted', 'LoadFinished', 'UrlChanged',
        'NavigationRequested', 'RepaintRequested', 'ResourceRequested',
        'ResourceReceived', 'ResourceError', 'ResourceTimeout',
        'Alert', 'ConsoleMessage', 'Closing',
    ];

    var self = this;
    events.forEach(function(event){
        self._page.set('on' + event, function(){
            var args = [event].concat([].slice.call(arguments));
            self.emit.apply(self, args);
        });
    });
};

proto.open =  function(url){
    var deferred = P.defer();

    var args = [].slice.call(arguments);
    args.push(function(status){
        if(status === 'success'){
            deferred.resolve();
        }
        else{
            deferred.reject(status);
        }
    })
    this._page.open.apply(this._page, args);
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

proto.waitFor = function(event){
    var deferred = P.defer();
    this.on(event, function(ret){
        deferred.resolve(ret);
    });
    return deferred.promise;
};

module.exports = Page;
