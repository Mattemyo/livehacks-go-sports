const express = require('express');
const consola = require('consola');
const { Nuxt, Builder } = require('nuxt');
const { app } = require('express-ws')(express())

const wsHandler = require('./ws');

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js');
config.dev = process.env.NODE_ENV !== 'production';

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  const { host, port } = nuxt.options.server;
  
  app.get('/api/health', (req, res) => {
      res.send('healthy!');
    });
  
  app.ws('/:gameId/ws', wsHandler);

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  } else {
    await nuxt.ready();
  }

  // Give nuxt middleware to express
  app.use(nuxt.render);

  // GET IP ADDRESS
  require('dns').lookup(require('os').hostname(), (err, add) => {
    if (err) {
      console.log(err);
      process.exit(0);
    }
    const address = `http://${add}:${port}`;
    console.log('IP Address on Network: ' + address);
    global.IP_ADDRESS = address;
  });

  // Listen the server
  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  });
}
start();
