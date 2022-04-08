const { Client } = require('pg')
const db_data = require('../../config/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { AuthenticationError, ForbiddenError } = require('apollo-server-express');
//const { user } = require('pg/lib/defaults');
require('dotenv').config();

const client = new Client(db_data);

client.connect()
.then(() => {
    console.log("Conected to database")
})
.catch(() => {
    throw new Error("Conection to database failed")
})

module.exports = {
    signUp: async (_, { username, email, password }) => {
        email = email.trim().toLowerCase()
        const hashed = await bcrypt.hash(password, 10)
        const sql = 'INSERT INTO pilots(username, email, password, created_at, updated_at) VALUES ($1, $2, $3, $4, $5);'
        const values = [username, email, hashed, new Date().toISOString(), new Date().toISOString()]

        try {
            user = await client.query(sql, values)
            client.end()
            return jwt.sign({id: user.id}, process.env.JWT_SECRET)

        } catch (err){
            console.log(err)
            throw new Error('Error creating account')
        }
    },
    signIn: async (_, {email, password}) => {
        email = email.trim().toLowerCase()
        const sql = 'SELECT * FROM pilots WHERE email = $1'
        const values = [email]

        try {
            user = await client.query(sql, values)
            client.end()
            console.log(user)
            user = user.rows[0]
            const valid = await bcrypt.compare(password, user.password)
            //if (!valid) {throw new AuthenticationError ('Error')}
            return jwt.sign({ id: user.id }, process.env.JWT_SECRET)

        } catch (err){
            console.log(err)
            throw new AuthenticationError('Error sign in')
        }
    }


}