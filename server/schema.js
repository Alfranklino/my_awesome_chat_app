const { gql } = require("apollo-server-express");

module.exports = gql`
  #   Query, Mutation, Subscription
  type Query {
    getAllUsers: [User]!
    test: String
  }

  type Mutation {
    
  }

  #   Main Customs Types

  type User {
    id: ID!
    fullname: String!
    password: String!
    email: String!
    location: String
    date_of_birth: String
    phone_number: String
    date_created: String
    avatar: String
    status: String
  }

  # Main Inputs

  # User------------------------
  input SignupInput {
    fullname: String!
    password: String!
    email: String!
    date_of_birth: String
    phone_number: String
    avatar: String
    location: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input LogoutInput {
    id: ID
  }
`;
