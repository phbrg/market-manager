const port = 3001;

const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(cors({ credentials: true, origin: `http://localhost:${port}` }));

// database
const conn = require('./db/conn');

const User = require('./models/User');
const Product = require('./models/Product');
const Sale = require('./models/Sale');

// routes
const AdminRoute = require('./routes/AdminRoute');
const AdminController = require('./controllers/AdminController');

const UserRoute = require('./routes/UserRoute');
const UserController = require('./controllers/UserController');

app.use('/admin', AdminRoute);
app.use('/', UserRoute);

// server
conn
    //.sync({ force: true })
    .sync()
    .then(() => app.listen(port, console.log(`> server on...`)))
    .catch((err) => console.log(`Sync Error: ${err}`));
