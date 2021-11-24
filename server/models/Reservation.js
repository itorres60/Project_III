const { Schema, model } = require('mongoose');

const reservationSchema = new Schema(
    {
        start: {
            type: String
        },
        end: {
            type: String
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
