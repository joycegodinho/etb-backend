const { gql } = require('apollo-server-express');

module.exports = gql`
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
type Query {
    etbs: [Etb!]!
}
`;