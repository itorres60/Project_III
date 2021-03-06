const { Schema, model } = require('mongoose');

const reservationSchema = new Schema(
    {
        title: {
            type: String
        },
        start: {
            type: String
        },
        end: {
            type: String
        },
        requestedUser: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        assignedUser: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        isAvailable: {
            type: Boolean,
            default: false
        }
    }
);

const Reservation = model('Reservation', reservationSchema);

module.exports = Reservation;
