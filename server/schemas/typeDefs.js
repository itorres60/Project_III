const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Calendar {
    _id: ID
    companyName: String
    users: [String]
    admin: User
  }

  type Reservation {
    _id: ID
    title: String
    start: String
    end: String
    assigneedUser: User
    isAvailable: Boolean
  }

  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    calendars: [Calendar]
    reservations: [Reservation]
    role: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    users: [User]
    user(email: String!): User
    calendars: [Calendar]
    calendar(calendarId: ID!): Calendar
    reservations: [Reservation]
    reservation(reservationId: ID!): Reservation
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    createUser(firstName: String!, lastName: String!, email: String!, password: String!, role: String!): Auth
    createCalendar(companyName: String!): Calendar
    removeCalender(calendarId: ID!): Calender
    addUser(calendarId: ID!, email: String!): Calendar
    removeUser(calendarId: ID!, email: String!): Calendar
    addReservation( title: String!,  start: String!, end: String!, assigneedUser: User!): Reservation
    removeReservation(reservationId: ID!): Reservation
  }
`;

module.exports = typeDefs;
