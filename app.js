const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const usersRoutes = require('./routes/users');
const middleware = require('./middleware')
const auth = require('./auth')

const cookieParser = require('cookie-parser') 

const app = express()
app.use(bodyParser.json({ extended: false }));
app.use(middleware.cors)

app.use(cookieParser()) 

app.post('/login', auth.authenticate, auth.login)


app.use(morgan('tiny'))

app.use('/users', auth.ensureAdmin, usersRoutes)


app.get('/', (req, res, next) => {res.send('Home')})

app.use(middleware.handleError)
app.use(middleware.notFound)

app.listen(3003);
