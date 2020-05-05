const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const usersRoutes = require('./routes/users');

const app = express();

app.use(morgan('tiny'))

app.use(bodyParser.json({ extended: false }));

app.use('/users', usersRoutes)

app.get('/', (req, res, next) => {res.send('Home')})

app.listen(3000);
