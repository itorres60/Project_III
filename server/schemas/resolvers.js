const { AuthenticationError } = require('apollo-server-express');
const { User, Calendar, Reservation } = require('../models');
const { signToken } = require('../utils/auth');

// I need to figure out a nice way of checking that the user exists when added to a calendar and if they do exist then add them otherwise on signup they will be added

const resolvers = {
  Query: {
    // returns information about current user
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')

        return userData;
      }

      throw new AuthenticationError('Not logged in');
    },
    // returns information about all users
    users: async () => {
      return User.find()
        .select('-__v -password')
    },
    // returns information about a single user based on email
    user: async (parent, { email }) => {
      return User.findOne({ email })
        .select('-__v -password')
    },
    // returns information about all calendars
    calendars: async () => {
      return Calendar.find()
        .select('-__v')
    },
    // returns information about a single calendar based on _id
    calendar: async (parent, { calendarId }) => {
      return Calendar.findOne({ _id: calendarId })
        .select('-__v')
    },
    // returns information about all reservations
    reservations: async () => {
      return Reservation.find()
        .select('-__v')
    },
    // returns information about a single reservation based on _id
    reservation: async (parent, { reservationId }) => {
      return Reservation.findOne({ _id: reservationId })
        .select('-__v')
    }
  },

  Mutation: {
    // creates a user
    createUser: async (parent, args) => {
      // creates a new user
      const user = await User.create(args);
      // writes a token for login authentication
      const token = signToken(user);

      // find all calendars
      const calendars = await Calendar.find()
        .select('-__v');

      // This is O(n^2) - Not Optimal but works for now
      // loop through calendars with employees
      await calendars.forEach(async (calendar) => {
        // loop through calendar employees to check if the created user's email exists
        await calendar.users.forEach(async (email) => {
          // if it does exist then add the calendar id to the created user's calendar array
          if (email === user.email) {
            // add calendar to created user's calendar array
            await User.findOneAndUpdate(
              { email },
              { $addToSet: { calendars: calendar._id } },
              { new: true }
            )
          }
        })
      })

      return { token, user };
    },
    // logs in a user
    login: async (parent, { email, password }) => {
      // finds a user based on email
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      // checks that the password is correct
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      // writes a token for login authentication
      const token = signToken(user);
      return { token, user };
    },
    // creates an empty calendar - admin required
    createCalendar: async (parent, { companyName }, context) => {
      // creates a new calendar with the logged in user as the admin
      if (context.user) {
        const calendar = await Calendar.create({
          companyName,
          users: [],
          admin: context.user._id
        });

        // adds calendar id to user's calendar array
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { calendars: calendar._id } },
          { new: true }
        )

        return calendar;
      }

      throw new AuthenticationError('Not Admin.');
    },
    // adds a user to a calendar - admin required
    addUser: async (parent, { calendarId, email }, context) => {
      // finds a calendar with the given calendarId
      const calendar = await Calendar.findOne({ _id: calendarId });
      // checks if the user's id equals the calendar's admin's id
      if (context.user._id == calendar.admin) {
        // updates the calendar's user array with the email provided
        const calendarUpdate = await Calendar.findOneAndUpdate(
          { _id: calendarId },
          { $addToSet: { users: email } },
          { new: true }
        );

        // adds calendar id to user's calendar array
        await User.findOneAndUpdate(
          { email },
          { $addToSet: { calendars: calendar._id } },
          { new: true }
        );

        return calendarUpdate;
      }

      throw new AuthenticationError('Not Admin of Calendar.');
    },
    removeUser: async (parent, { calendarId, email }, context) => {
      // finds a calendar with the given calendarId
      const calendar = await Calendar.findOne({ _id: calendarId });
      // checks if the user's id equals the calendar's admin's id
      if (context.user._id == calendar.admin) {
        // updates the calendar's user array with the email provided
        const calendarUpdate = await Calendar.findOneAndUpdate(
          { _id: calendarId },
          { $pull: { users: email } },
          { new: true }
        );

        await User.findOneAndUpdate(
          { email },
          { $pull: { calendars: calendar._id } },
          { new: true }
        );

        return calendarUpdate;
      }

      throw new AuthenticationError('Not Admin of Calendar.');
    },
    // removes a calendar and all information from the calendar
    removeCalendar: async (parent, { calendarId }, context) => {
      if (context.user) {
        const calendar = await Calendar.findOneAndDelete({ _id: calendarId });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { calendars: calendar._id } },
          { new: true }
        )

        return calendar;
      }
      throw new AuthenticationError('Not Admin of Calendar.');
    },
    // adds a requested reservation to a calendar
    createReservation: async (parent, { title, start, end, calendarId }, context) => {
      if (context.user) {
        const reservation = await Reservation.create({
          title,
          start,
          end,
          requestedUser: context.user._id
        });

        await Calendar.findOneAndUpdate(
          { _id: calendarId },
          { $addToSet: { reservations: reservation._id } },
          { new: true }
        )

        return reservation;
      }
    },
    // removes a requested reservation from a calendar
    removeReservation: async (parent, { reservationId, calendarId }, context) => {
      if (context.user) {
        const reservation = await Reservation.findOneAndDelete({ _id: reservationId });

        await Calendar.findOneAndUpdate(
          { _id: calendarId },
          { $pull: { reservations: reservation._id } },
          { new: true }
        )

        return reservation;
      }
      throw new AuthenticationError('Not Your Reservation.');
    },
    // assigns a relief operator to a reservation
    acceptReservation: async (parent, { reservationId }, context) => {
      if(context.user) {
        const reservation = await Reservation.findOneAndUpdate(
          { _id: reservationId },
          { assignedUser: context.user._id },
          { new: true }
          );

        return reservation;
      }

      throw new AuthenticationError('Not Your Reservation.');
    },
    removeReservationAccept: async (parent, { reservationId }, context) => {
      if(context.user) {
        const reservation = await Reservation.findOneAndUpdate(
          { _id: reservationId },
          { assignedUser: null },
          { new: true }
          );

        return reservation;
      }

      throw new AuthenticationError('Not Your Reservation.');
    }
  }
};

module.exports = resolvers;
