const { Client } = require('pg')
const db_data = require('../../config/db')
const { AuthenticationError, ForbiddenError } = require('apollo-server-express');


const client = new Client(db_data);

client.connect()
.then(() => {
    console.log("Conected to database")
})
.catch(() => {
    throw new Error("Conection to database failed")
})

let stations = []

client.query('SELECT * FROM pois', (err, res) => {
    stations = res.rows
    client.end()
})

module.exports = {
    etbs: async (_, __, { user }) => {
        if(!user) {
            throw new AuthenticationError('You must be sign in to pull stations')
        }
        return stations
    }
}