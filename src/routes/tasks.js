const express = require('express')
const Task = require('../models/task')
const User = require('../models/user')
const Appointment = require('../models/appointment')

const tasksRouter = express.Router()
const bodyParser = require('body-parser')
const cors = require('cors')

tasksRouter.use(bodyParser.json())
var origins = ['http://localhost:8080']
tasksRouter.use(cors({ origin: origins, credentials: true }))

tasksRouter.post('/create', function (req, res, next) {
  var userId = req.session.userId || req.headers.token
  if (userId === null || userId === 'null' || userId === '') {
    return res.status(401).json({ error: 'Please log in to see this page' })
  }
  console.log('UserId: ' + userId)
  User.findById(userId)
    .exec(function (error, user) {
      if (error) {
        return next(error)
      }
      if (user === null) {
        return res.status(401).json({ error: 'Please log in to see this page' })
      }
      var taskData = {
        userId: userId,
        name: req.body.name,
        week: req.body.week,
        year: req.body.year,
        color: req.body.color,
        hours: req.body.hours
      }
      console.log(taskData)
      Task.create(taskData, function (error, doc) {
        if (error) {
          return next(error)
        }
        console.log('Inserted: ', doc)
        return res.status(201).end()
      })
    })
})

tasksRouter.get('/:id', function (req, res, next) {
  var userId = req.session.userId || req.headers.token
  if (userId === null || userId === 'null' || userId === '') {
    return res.status(401).json({ error: 'Please log in to see this page' })
  }
  console.log('UserId: ' + userId)
  User.findById(userId)
    .exec(function (error, user) {
      if (error) {
        return next(error)
      }
      if (user === null) {
        return res.status(401).json({ error: 'Please log in to see this page' })
      }
      console.log('Requested Id:', req.params.id)
      const id = req.params.id
      Task.findOne({ _id: id }, function (error, doc) {
        if (error) {
          return next(error)
        }
        if (doc === null) {
          return res.status(404).json({ 'error': 'Task is not found' })
        }
        return res.status(200).json(doc)
      })
    })
})

tasksRouter.get('/', function (req, res, next) {
  console.log('Request: ' + JSON.stringify(req.query))
  var userId = req.session.userId || req.headers.token
  if (userId === null || userId === 'null' || userId === '') {
    return res.status(401).json({ error: 'Please log in to see this page!' })
  }
  console.log('UserId: ' + userId)
  User.findById(userId)
    .exec(function (error, user) {
      if (error) {
        return next(error)
      }
      if (user === null) {
        return res.status(401).json({ error: 'Please log in to see this page!!!' })
      }
      var week = parseInt(req.query.week)
      var year = parseInt(req.query.year)

      Task.find({ year: year, week: week }, function (error, docs) {
        if (error) {
          return next(error)
        }
        if (docs === null || docs.length === 0) {
          return res.status(404).json({ 'error': 'No tasks' })
        }
        return res.status(200).json(docs)
      })
    })
})

tasksRouter.delete('/:id', function (req, res, next) {
  var userId = req.session.userId || req.headers.token
  if (userId === null || userId === 'null' || userId === '') {
    return res.status(401).json({ error: 'Please log in to see this page' })
  }
  console.log('UserId: ' + userId)
  User.findById(userId)
    .exec(function (error, user) {
      if (error) {
        console.log('Error: ', error)
        return next(error)
      }
      if (user === null) {
        return res.status(401).json({ error: 'Please log in to see this page' })
      }
      const id = req.params.id
      Task.findOne({ userId: userId, _id: id }, function (error, doc) {
        if (error) {
          return next(error)
        }
        if (doc === null) {
          console.log('Found: ', doc)
          return res.status(400).json({ error: 'Task is not found.' })
        }
        var taskId = doc._id
        Appointment.find({ 'taskId': taskId }, function (error, appointments) {
          if (error) {
            return next(error)
          }
          if (appointments !== null && appointments.length !== 0) {
            var appointmentIds = []
            for (var i = 0; i < appointments.length; i++) {
              appointmentIds.push(appointments[i]._id)
            }
            Appointment.remove({ _id: { $in: appointmentIds } }, function (error, doc) {
              if (error) {
                return next(error)
              }
            })
          }
        })
        Task.remove({ _id: taskId }, function (error, doc) {
          if (error) {
            return next(error)
          }
          return res.status(204).end()
        })
      })
    })
})

module.exports = tasksRouter
