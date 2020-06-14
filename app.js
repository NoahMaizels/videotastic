require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
// const morgan = require('morgan')
const cors = require('cors')
const morganBody = require('morgan-body')
const usersRoutes = require('./routes/users');
const commentsRoutes = require('./routes/comments');
const middleware = require('./middleware')
const auth = require('./auth')
const PORT = process.env.PORT || 3000

const cookieParser = require('cookie-parser') 

const app = express()

morganBody(app)
// app.use(morgan('tiny'))
app.use(bodyParser.json({ extended: false }));
app.use(middleware.cors)
// corsOptions = {
//   preflightContinue: true,
//   origin: '*',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
// app.use(cors(corsOptions))

app.use(cookieParser()) 

app.options('/*', auth.optionsLogin)
app.post('/login', auth.authenticate, auth.login)
app.options('/login', auth.authenticate, auth.login)


// app.use('/users', auth.ensureAdmin, usersRoutes)
app.use('/users', usersRoutes)
app.use('/comments', commentsRoutes)
app.use('/currentuser', auth.currentUser)

app.get('/', (req, res, next) => {res.send('Home')})

app.use(middleware.handleError)
app.use(middleware.notFound)

app.listen(PORT);
console.log(`App listening on ${PORT}`)