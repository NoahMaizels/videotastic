const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const videosRoutes = require('./routes/videos');

const app = express();

app.use(morgan('tiny'))

app.use(bodyParser.json({ extended: false }));

app.use('/videos', videosRoutes)

app.get('/', (req, res, next) => {res.send('Home')})

app.listen(3000);
