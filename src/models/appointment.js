var mongoose = require('mongoose')

var AppointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    unique: false,
    required: true,
    trim: false
  },
  taskId: {
    type: mongoose.Schema.ObjectId,
    unique: false,
    required: true,
    trim: false
  },
  title: {
    type: String,
    unique: false,
    required: true,
    trim: false
  },
  startDate: {
    type: Date,
    unique: false,
    required: true,
    trim: false
  },
  endDate: {
    type: Date,
    unique: false,
    required: true,
    trim: false
  },
  notes: {
    type: String,
    unique: false,
    required: false,
    trim: false
  }
})

var Appointment = mongoose.model('Appointment', AppointmentSchema)
module.exports = Appointment
