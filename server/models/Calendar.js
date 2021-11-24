const { Schema, model } = require('mongoose');

const calendarSchema = new Schema(
  {
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
  }  
);

const Calendar = model('Calendar', calendarSchema);

module.exports = Calendar;
