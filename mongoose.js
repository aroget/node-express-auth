const mongoose = require('mongoose');
const env = require('./config');

const db = mongoose.connection;
mongoose.Promise = global.Promise;

if (env() === 'prod') {
  mongoose.connect('mongodb://heroku_jgwsg0jn:hgov545bejqi62vltnuun06fhu@ds145295.mlab.com:45295/heroku_jgwsg0jn');
} else if (env() === 'dev') {
  mongoose.connect('mongodb://localhost/app');
}

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected');
});

