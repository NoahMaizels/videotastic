const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const usersRoutes = require('./routes/users');
const middleware = require('./middleware')

const app = express();

app.use(middleware.cors)

app.use(morgan('tiny'))

app.use(bodyParser.json({ extended: false }));

app.use('/users', usersRoutes)

app.get('/', (req, res, next) => {res.send('Home')})

app.listen(3001);
