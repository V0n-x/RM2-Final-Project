require('dotenv').config();
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const helmet = require('helmet');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redis = require('redis');

const router = require('./router.js');

// socket
// https://socket.io/how-to/use-with-react
const socketSetup = require('./io.js');

const port = process.env.PORT || process.env.NODE_PORT || 8000;

const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/Showdown';

mongoose.connect(dbURI).catch((err) => {
  if (err) {
    throw err;
  }
});

const redisClient = redis.createClient({
  url: process.env.REDISCLOUD_URL,
});

redisClient.on('error', () => {}/* console.log('Redis Client Error', err) */);

redisClient.connect().then(() => {
  const app = express();

  app.use(helmet());
  app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
  app.use(favicon(`${__dirname}/../hosted/img/favicon.jpg`));
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use((req, res, next) => {
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", 'https://cdnjs.cloudflare.com', "'unsafe-inline'"], // Allow styles from self and CDN
        imgSrc: ["'self'", 'https://raw.githubusercontent.com'], // Allow images from self and specified URL
        connectSrc: ["'self'", 'https://pokeapi.co'], // Allow connections to pokeapi.co
      // Add other directives as needed
      },
    })(req, res, next);
  });

  app.use(session({
    key: 'sessionid',
    store: new RedisStore({
      client: redisClient,
    }),
    secret: 'Bootleg Showdown',
    resave: false,
    saveUninitialized: false,
  }));

  app.engine('handlebars', expressHandlebars.engine({ defaultLayout: '' }));
  app.set('view engine', 'handlebars');
  app.set('views', `${__dirname}/../views`);

  router(app);

  const server = socketSetup(app);

  server.listen(port, (err) => {
    if (err) { throw err; }
    console.log(`Listening on port ${port}`);
  });
});
