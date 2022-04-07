const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const helmet = require('helmet');
const cors = require('cors');

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

    const server = new ApolloServer({ typeDefs, resolvers })

    await server.start()

    server.applyMiddleware({ app, path: '/api'});

    app.listen({port}, () => console.log(`GraphQL Server running at http:localhost:${port}${server.graphqlPath}`));

    return {server, app}

}

startApolloServer()