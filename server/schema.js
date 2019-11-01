const { gql } = require("apollo-server-express");

module.exports = gql`
  #   Query, Mutation, Subscription

  scalar Date

  type Query {
    getUsers: [User]!
    getUserInfo(input: QueryUserInput!): User!
    getGroups: [Group]!
    getGroupInfo(input: QueryGroupInput!): Group!
    getMessages: [Message]!
    getMessageInfo(input: QueryMessageInput!): Message!
    getSessions: [Session]!
    test: String
  }

  type Mutation {
    setNewUser(userInfo: UserInput!): User!
    setNewGroup(groupInfo: GroupInput!): Group!
    setNewMessage(messageInfo: MessageInput!): Message!
    addMemberToGroup(memberInfo: MemberInput!): Group!
    openSession(openSessionInfo: SessionInput!): Session!
    closeSession(closeSessionInfo: SessionInput!): Session!
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
    messagesReceived: [Message]
    messagesSent: [Message]
    groups: [Group]
    sessions: [Session]!
  }

  type Group {
    id: ID!
    created_by: User!
    members: [User]!
    group_title: String!
    time_created: Date!
  }

  type Message {
    id: ID!
    content: String!
    from_user: User!
    to_user: User
    to_group: Group
    time_created: Date!
  }

  type Session {
    id: ID!
    user: User!
    time_session_starts: Date
    time_session_ends: Date
  }

  # Main Inputs

  #---Queries------------------------
  input QueryUserInput {
    userId: Int!
    userEmail: String
  }
  input QueryGroupInput {
    creatorId: Int
    group_title: String
  }
  input QueryMessageInput {
    messageId: Int
  }

  #---Mutations----------------------
  input UserInput {
    fullname: String!
    password: String!
    email: String!
  }
  input GroupInput {
    creatorId: Int!
    group_title: String!
  }
  input MemberInput {
    userId: Int!
    groupId: Int!
  }
  input SessionInput {
    userId: Int!
  }
  input MessageInput {
    content: Int!
    from_user: Int!
    to_user: Int
    to_group: Int
  }
`;
