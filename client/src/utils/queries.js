import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query user($email: String!) {
    user(email: $email) {
      _id
      firstName
      lastName
      email
    }
  }
`;

export const QUERY_USERS = gql`
    query users {
      users {
        _id
        firstName
        lastName
        email
        calendars {
          _id
        }
        role
      }
    }
`

export const QUERY_ME = gql`
    query me {
      _id
      firstName
      lastName
      email
      role
    }
`;

export const QUERY_CALENDARS = gql`
    query calendars {
      calendars {
        _id
        companyName
        users
        admin {
          _id
        }
      }
    }
`;

export const QUERY_CALENDAR = gql`
  query calendar($calendarId: ID!) {
    calendar(calendarId: $calendarId) {
      _id
      companyName
      users
      admin {
        _id
      }
    }
  }
`;
