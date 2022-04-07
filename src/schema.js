const { gql } = require('apollo-server-express');

module.exports = gql`
scalar DateTime
type Etb {
    id: ID!
    name: String
    model: String
    serial_number: String
    nickname: String
    state: String
    year: String
    batch: String
    latlng: String
    type: String
}

type User {
    id: ID!
    username: String!
    email: String!
    createdAt: DateTime!
    updatedAt: DateTime!
}

type Query {
    etbs: [Etb!]!
}

type Mutation {
    signUp(username:String!, email:String!, password: String!): String!
    signIn(email:String!, password: String!): String!
}
`;