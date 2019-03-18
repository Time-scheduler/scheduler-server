#!/usr/bin/env node
const express = require('express')
const app = express()
const path = require('path')
const less = require('less-middleware')
const tasksRouter = require('./routes/tasks')
const appointmentsRouter = require('./routes/appointments')
const profileRouter = require('./routes/profile')
var mongoose = require('mongoose')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var bodyParser = require('body-parser')

// connect to MongoDB
mongoose.connect('mongodb://localhost/scheduler-users')
var db = mongoose.connection

// handle mongo error
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  // we're connected!
})

// use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}))

// Compile and serve CSS
app.use(
  less(path.join(__dirname, 'source', 'less'), {
    dest: path.join(__dirname, 'public'),
    options: {
      compiler: {
        compress: false
      }
    },
    preprocess: {
      path: function (pathname, req) {
        return pathname.replace('/css/', '/')
      }
    },
    force: true
  })
)

// Serve static content
app.use(express.static(path.join(__dirname, 'public')))

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use('/api/tasks', tasksRouter)
app.use('/api/appointments', appointmentsRouter)
app.use('/api/profile', profileRouter)

// Route the HTTP GET request
app.get('/home', function (req, res) {
  console.log('This is the home page!')
  // nothing special to do here yet
  res.status(200).end()
})

app.use((req, res) => {
  return res.status(400).json({ message: 'Invalid request' })
})

// setup server
var server = app.listen(3000)
// console.log(app._router.stack)

module.exports = app
