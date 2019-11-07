const { gql } = require("apollo-server-express");

module.exports = gql`
  #   Query, Mutation, Subscription

  scalar Date

  type Query {
    getUsers: [User]! #OK
    getUserInfo(input: QueryUserInput!): User! #OK
    getConnectedUsers: [User!]!
    getGroups: [Group]! #OK
    getGroupInfo(input: QueryGroupInput!): Group!
    getMessages: [Message]! #OK
    getMessageInfo(input: QueryMessageInput!): Message!
    getSessions: [Session]!
    #This query below seems to be useless, since the same info are provided by User Type (Sessions...)
    getSessionInfo(input: QuerySessionInput!, last: Int): [Session!]! #I can return the Current session by (last and status in the resolver.)
    test: String
  }

  type Mutation {
    createNewUser(userInfo: UserInput!): User! #1 - OK
    createNewGroup(groupInfo: GroupInput!): Group!
    sendNewMessage(messageInfo: MessageInput!): Message! #2 - OK
    addMemberToGroup(memberInfo: MemberInput!): Group!
    openSession(openSessionInfo: SessionInput!): Session! #3 - OK
    closeSession(closeSessionInfo: SessionInput!): Session! #4 - OK
  }

  type Subscription {
    count: Int!
    listenMessage(subscribeMessageInfo: SubscribeMessageInput!): Message!
  }

  #   Enum

  #   Main Customs Types

  type User {
    id: ID!
    fullname: String!
    password: String!
    email: String!
    location: String
    date_of_birth: String
    phone_number: String
    date_created: Date
    avatar: String
    status: String
    messagesReceived: [Message]
    messagesSent: [Message]
    groups: [Group]
    sessions: [Session]!
    currentSession: Session
  }

  type Group {
    id: ID!
    created_by: User!
    members: [User]!
    members_count: Int!
    group_title: String!
    time_created: Date!
    messages: [Message!]
    messages_count: Int!
  }

  type Message {
    id: ID!
    content: String!
    from_user: User!
    to_user: User
    to_group: Group
    time_created: Date!
    destination: String! # Enum: {USER, GROUP}
  }

  type Session {
    id: ID!
    user: User!
    time_start: Date
    time_end: Date
    status: String! # Enum: {CONNECTED, DISCONNECTED}
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
  input QuerySessionInput {
    userId: Int
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
    userId: Int
    sessionId: Int
  }
  input SessionCloseInput {
    sessionId: Int!
  }
  input MessageInput {
    content: String!
    from_user: Int!
    to_user: Int
    to_group: Int
    destination: String! # Enum: {USER, GROUP}
  }

  #---Subscriptions----------------------

  input SubscribeMessageInput {
    to_user: Int
    to_group: Int
    destination: String! # Enum: {USER, GROUP}
  }
`;
