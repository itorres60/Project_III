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
