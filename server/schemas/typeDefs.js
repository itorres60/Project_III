const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Calendar {
    _id: ID
    companyName: String
    users: [String]
    reservations: [Reservation]
    admin: User
  }

  type Reservation {
    _id: ID
    title: String
    start: String
    end: String
    requestedUser: User
    assigneedUser: User
    isAvailable: Boolean
  }

  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    calendars: [Calendar]
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
    removeCalendar(calendarId: ID!): Calendar
    addUser(calendarId: ID!, email: String!): Calendar
    removeUser(calendarId: ID!, email: String!): Calendar
    createReservation(title: String!,  start: String!, end: String, calendarId: ID!): Reservation
    removeReservation(reservationId: ID!, calendarId: ID!): Reservation 
  }
`;

module.exports = typeDefs;
