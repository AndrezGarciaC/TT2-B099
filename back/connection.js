const mongoose = require('mongoose');
const db = mongoose.connection;
require('dotenv').config();

mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

db.on('error', err => { console.log(err); })
db.once('open', _ => { console.log('Database conectada a:', process.env.URI); })