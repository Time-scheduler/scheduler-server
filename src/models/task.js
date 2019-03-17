var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

var TaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    unique: false,
    required: true,
    trim: false
  },
  name: {
    type: String,
    unique: false,
    required: true,
    trim: false
  },
  week: {
    type: Number,
    unique: false,
    required: true,
    trim: false,
    validate: {
      validator: function (value) {
        return value >= 1 && value <= 52
      },
      message: 'Value must be in a range 1-52'
    }
  },
  year: {
    type: Number,
    unique: false,
    required: true,
    trim: false,
    validate: {
      validator: function (value) {
        return value >= 1950 && value <= 3000
      },
      message: 'Value must be a year'
    }
  },
  color: {
    type: String,
    unique: false,
    required: true,
    trim: false
  },
  hours: {
    type: Number,
    unique: false,
    required: false,
    trim: false
  }
})

var Task = mongoose.model('Task', TaskSchema)
module.exports = Task
