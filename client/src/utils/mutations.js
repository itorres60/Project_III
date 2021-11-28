import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        email
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation createUser($firstName: String!, $lastName: String!, $email: String!, $password: String!, $role: String!) {
    createUser(firstName: $firstName, lastName: $lastName, email: $email, password: $password, role: $role) {
      token
      user {
        _id
        firstName
        lastName
        email
        role
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUserMutation($calendarId: ID!, $email: String!) {
    addUser(calendarId: $calendarId, email: $email) {
        _id
        users
    }
  }
`;

export const REMOVE_USER = gql`
  mutation removeUserMutation($calendarId: ID!, $email: String!) {
    removeUser(calendarId: $calendarId, email: $email) {
        _id
        users
    }
  }
`;

export const CREATE_CALENDAR = gql`
  mutation createCalendarMutation($companyName: String!){
    createCalendar(companyName: $companyName) {
      _id
      companyName
      admin {
        _id
      }
    }
  }
`;