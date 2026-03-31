'use strict'

var express = require('express');
var fs = require('node:fs');
var path = require('node:path');

module.exports = function (parent, options) {
  var dir = path.join(__dirname, '..', 'controllers');
  var verbose = options.verbose;

  fs.readdirSync(dir).forEach(function (name) {
    var file = path.join(dir, name);

    if (!fs.statSync(file).isDirectory()) return;

    verbose && console.log('\n   %s:', name);

    var obj = require(file);
    var routeName = obj.name || name;
    var prefix = obj.prefix || '';
    var app = express();
    var handler;
    var method;
    var url;

    if (obj.engine) app.set('view engine', obj.engine);
    app.set('views', path.join(__dirname, '..', 'controllers', routeName, 'views'));

    for (var key in obj) {
      if (~['name', 'prefix', 'engine', 'before'].indexOf(key)) continue;

      switch (key) {
        case 'show':
          method = 'get';
          url = '/' + routeName + '/:' + routeName + '_id';
          break;
        case 'list':
          method = 'get';
          url = '/' + routeName + 's';
          break;
        case 'edit':
          method = 'get';
          url = '/' + routeName + '/:' + routeName + '_id/edit';
          break;
        case 'update':
          method = 'put';
          url = '/' + routeName + '/:' + routeName + '_id';
          break;
        case 'partialUpdate':
          method = 'patch';
          url = '/' + routeName + '/:' + routeName + '_id';
          break;
        case 'delete':
          method = 'delete';
          url = '/' + routeName + '/:' + routeName + '_id';
          break;
        case 'create':
          method = 'post';
          url = '/' + routeName;
          break;
        case 'index':
          method = 'get';
          url = '/';
          break;
        default:
          throw new Error('unrecognized route: ' + name + '.' + key);
      }

      handler = obj[key];
      url = prefix + url;

      if (obj.before) {
        app[method](url, obj.before, handler);
        verbose && console.log('     %s %s -> before -> %s', method.toUpperCase(), url, key);
      } else {
        app[method](url, handler);
        verbose && console.log('     %s %s -> %s', method.toUpperCase(), url, key);
      }
    }

    parent.use(app);
  });
};