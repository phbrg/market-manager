const port = 3001;

const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(cors({
    origin: `http://localhost:${port}`,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    maxAge: 3600
}));

// database
const conn = require('./db/conn');

const User = require('./models/User');
const Product = require('./models/Product');
const Sale = require('./models/Sale');

// routes
const AdminRoute = require('./routes/AdminRoute');
const AdminController = require('./controllers/AdminController');
app.use('/admin', AdminRoute);

const UserRoute = require('./routes/UserRoute');
const UserController = require('./controllers/UserController');
app.use('/', UserRoute);


// server
conn
    //.sync({ force: true })
    .sync()
    .then(() => app.listen(port, console.log(`> server on...`)))
    .catch((err) => console.log(`Sync Error: ${err}`));
