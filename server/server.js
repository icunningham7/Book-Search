const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');

const db = require('./config/connection');
const { authMiddleware, signToken } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const { request } = require('http');

const loggingPlugin = {
  async requestDidStart(requestContext) {
    console.info('Request started! Query:\n' + requestContext.request.query);

    return {
      async parsingDidStart(requestContext) {
        console.info('Parsing started! Parsing:\n');
        console.info(
          requestContext.request.operationName,
          requestContext.request.variables  
        );
        return async (err) => {
          if (err) {
            console.error(err);
          }
        };
      },

      async validationDidStart(requestContext) {
        console.info('Validation started!');
        return async (errs) => {
          if (errs) {
            errs.forEach((err) => console.error(err));
          }
        }
      },

      async didEncounterErrors(requestContext) {
        console.error('Encountered errors! Error:\n');
        console.error(requestContext.errors);
      },
    };
  },
};



const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // plugins: [loggingPlugin]
});

const app = express();

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
} else {
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}



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