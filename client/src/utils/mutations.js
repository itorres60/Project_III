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
  mutation addUser($calendarId: ID!, $email: String!) {
    addUser(calendarId: $calendarId, email: $email) {
        _id
        users
    }
  }
`;

export const REMOVE_USER = gql`
  mutation removeUser($calendarId: ID!, $email: String!) {
    removeUser(calendarId: $calendarId, email: $email) {
        _id
        users
    }
  }
`;

export const CREATE_CALENDAR = gql`
  mutation createCalendar($companyName: String!){
    createCalendar(companyName: $companyName) {
      _id
      companyName
      admin {
        _id
      }
    }
  }
`;

export const REMOVE_CALENDAR = gql`
  mutation removeCalendar($companyName: String!){
    removeCalender(companyName: $companyName) {
      _id
    }
  }
`;

export const CREATE_RESERVATION = gql`
  mutation createReservation($title: String!, $start: String!, $end: String, $calendarId: ID!) {
    createReservation(title: $title, start: $start, end: $end, calendarId: $calendarId) {
      _id
      title
      start
      end
    }
  }
`;

export const REMOVE_RESERVATION = gql`
  mutation removeReservation($reservationId: ID!, $calendarId:ID!) {
    removeReservation(reservationId: $reservationId, calendarId: $calendarId) {
      _id
      title
      start
      end
    }
  }
`;

export const ACCEPT_RESERVATION = gql`
  mutation acceptReservation($reservationId: ID!) {
    acceptReservation(reservationId: $reservationId) {
      _id
      title
      isAvailable
      assignedUser {
        _id
      }
    }
  }
`;

export const REMOVE_ACCEPTED_RESERVATION = gql`
  mutation removeAcceptReservation($reservationId: ID!) {
    removeReservationAccept(reservationId: $reservationId) {
      _id
      title
      assignedUser {
        _id
      }
    }
  }
`;
