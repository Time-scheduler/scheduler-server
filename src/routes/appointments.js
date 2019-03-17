const express = require('express')
const Appointment = require('../models/appointment')
const Task = require('../models/task')
const User = require('../models/user')

const appointentsRouter = express.Router()
const bodyParser = require('body-parser')
const cors = require('cors')

appointentsRouter.use(bodyParser.json())
var origins = ['http://localhost:8080']
appointentsRouter.use(cors({ origin: origins, credentials: true }))

appointentsRouter.post('/create', function (req, res, next) {
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
      var appointmentData = {
        userId: userId,
        taskId: req.body.taskId,
        title: req.body.title,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        notes: req.body.notes || ''
      }
      console.log(appointmentData)
      Appointment.create(appointmentData, function (error, doc) {
        if (error) {
          return next(error)
        }
        console.log('Inserted: ', doc)
        return res.status(201).end()
      })
    })
})

appointentsRouter.use('/:id', function (req, res, next) {
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
      Appointment.findOne({ _id: id }, function (error, doc) {
        if (error) {
          return next(error)
        }
        if (doc === null) {
          return res.status(404).json({ 'error': 'Appointment is not found' })
        }
        return res.status(200).json(doc)
      })
    })
})

appointentsRouter.get('/', function (req, res, next) {
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

      Task.find({ year: year, week: week }, function (error, tasks) {
        if (error) {
          return next(error)
        }
        if (tasks === null || tasks.length === 0) {
          return res.status(404).json({ 'error': 'No tasks' })
        }
        var taskIds = []
        for (var i = 0; i < tasks.length; i++) {
          taskIds.push(tasks[i]._id)
        }
        Appointment.find({ 'taskId': { $in: taskIds } }, function (error, appointments) {
          if (error) {
            return next(error)
          }
          if (appointments === null || appointments.length === 0) {
            return res.status(404).json({ 'error': 'No tasks' })
          }
          return res.status(200).json(appointments)
        })
      })
    })
})

module.exports = appointentsRouter
