/*
  expressive.js wraps express, inserting middleware to track how the server
  response and client request objects change as they travel through the developer's
  middleware.

  TODO: express.static
  TODO: wrap response methods?
  TODO: figure out how to handle multiple app.method calls for the same method.
  currently it will not be tracked when it goes past the first one.
  TODO: reconfigure listen method for all possible sets and configurations of listen
   arguments: (port, [hostname], [backlog], [callback]) or (path, [callback])
*/

const express = require('express'),
  app = express(),
  getAppMethodArgs = require('./util/getAppMethodArgs.js'),
  jsonController = require('./util/jsonController.js'),
  serverListeners = require('./util/serverListeners.js');

//wrapper for app.METHOD
//intersperses tracking midware between developer midware
function insertExpressiveMidware(method, ...args) {
  let expressiveMidware = getAppMethodArgs(args);
  return app[method.toLowerCase()](...expressiveMidware);
}

//stores route and method in json object for creation of default config file
//then wraps app.METHOD
function set(method, ...args) {
  const route = args[0];
  jsonController.addRoute(method, route);
  return insertExpressiveMidware(method, ...args);
}




const expressive = () => {
  const expressiveObj = {
    listen: (...args) => {
      const server = app.listen(...args);
      //set up server listeners!
      Object.keys(serverListeners).forEach(event => {
        server.on(event, serverListeners[event]);
      });
      //sends message to parent process, so that parent process knows it may start
      //firing requests!
      process.send('listening');
      return server;
    },
    use: (...args) => insertExpressiveMidware('use', ...args),
    // disable: () => {},
    // disabled: () => {},
    // enable: () => {},
    // enabled: () => {},
    // engine: () => {},
    // param: () => {},
    // path: () => {},
    // render: () => {},
    // route: () => {},
    // set: () => {}
  }

  const requestMethods = ['ALL', 'CHECKOUT', 'COPY', 'DELETE', 'GET', 'HEAD', 'LOCK', 'MERGE',
      'MKACTIVITY', 'MKCOL', 'MOVE', 'M-SEARCH', 'NOTIFY', 'OPTIONS', 'PATCH', 'POST',
      'PURGE', 'PUT', 'REPORT', 'SEARCH', 'SUBSCRIBE', 'TRACE', 'UNLOCK', 'UNSUBSCRIBE'];


  //assigns app.METHOD for all request methods
  requestMethods.forEach(method => {
    expressiveObj[method.toLowerCase()] = (...args) => set(method, ...args);
  });

  //assign all properties and methods of the express app to the expressiveObj that
  //aren't explicitly defined
  Object.keys(app).forEach(key => {
    if (!expressiveObj.hasOwnProperty(key)) expressiveObj[key] = app[key];
  });

  return expressiveObj;
}



module.exports = expressive;
