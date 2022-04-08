const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const helmet = require('helmet');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const typeDefs = require('./schema')
const resolvers = require('./resolvers/index')

async function startApolloServer() {

    const port = process.env.PORT || 4000;

    const app = express();

    app.use(helmet({
                    contentSecurityPolicy: (process.env.NODE_ENV === 'production') ? undefined : false,
                    crossOriginEmbedderPolicy: (process.env.NODE_ENV === 'production') ? undefined : false
                }));
    app.use(cors());

    const getUser = token => {
        if (token){
            try {
                return jwt.verify(token, process.env.JWT_SECRET)

            } catch (err) {
                throw new Error('Session invalid')

            }
        }
    }

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => {
            const token = req.headers.authorization
            const user = getUser(token)
            console.log(user)
            return { user }
        }
    })

    await server.start()

    server.applyMiddleware({ app, path: '/api'});

    app.listen({port}, () => console.log(`GraphQL Server running at http:localhost:${port}${server.graphqlPath}`));

    return {server, app}

}

startApolloServer()