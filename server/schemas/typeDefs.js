const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Calendar {
    _id: ID
    companyName: String
    users: [String]
    admin: User
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
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    createUser(firstName: String!, lastName: String!, email: String!, password: String!, role: String!): Auth
    createCalendar(companyName: String!): Calendar
    addUser(calendarId: ID!, email: String!): Calendar
    removeUser(calendarId: ID!, email: String!): Calendar
  }
`;

module.exports = typeDefs;
