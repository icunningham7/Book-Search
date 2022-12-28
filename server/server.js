const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');

const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');

const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app = express();



console.log('env:', process.env.NODE_ENV);

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  app.use(
    express.urlencoded({ extended: true }),
    express.json(),
    expressMiddleware(server, {
      context: authMiddleware
    })
  );

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
    });

  });
};

startApolloServer(typeDefs, resolvers);