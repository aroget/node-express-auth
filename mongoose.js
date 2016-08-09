const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// mongoose.connect('mongodb://localhost/app');
mongoose.connect('mongodb://heroku_jgwsg0jn:hgov545bejqi62vltnuun06fhu@ds145295.mlab.com:45295/heroku_jgwsg0jn');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected');
});

