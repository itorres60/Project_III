const { AuthenticationError } = require('apollo-server-express');
const { User, Calendar, Reservation } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')

        return userData;
      }

      throw new AuthenticationError('Not logged in');
    },
    users: async () => {
      return User.find()
        .select('-__v -password')
    },
    user: async (parent, { email }) => {
      return User.findOne({ email })
        .select('-__v -password')
    }
  },

  Mutation: {
    // creates a user
    createUser: async (parent, args) => {
      // creates a new user
      const user = await User.create(args);
      // writes a token for login authentication
      const token = signToken(user);

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
          { $push: { calendars: calendar._id } },
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

        return calendarUpdate;
      }

      throw new AuthenticationError('Not Admin of Calendar.');
    }
  }
};

module.exports = resolvers;
