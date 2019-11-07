const express = require("express");
// const { ApolloServer, PubSub } = require("apollo-server-express");
const { GraphQLServer, PubSub } = require("graphql-yoga");
const cors = require("cors"); //TODO: import this...
const cookieParser = require("cookie-parser");

const postgres = require("./config/postgres");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

const { authUtil } = require("./utils/"); //Here we can call the utils directory just because it contains an file named 'index.js'. If not it might be neccessary to import from the specific js file as we did before.

const app = express();
const PORT = 8080;

app.set("JWT_COOKIE_NAME", "token");
app.set("JWT_SECRET", "my_secret");
app.use(cookieParser());

const corsConfig = {
  origin: "http://localhost:3000",
  credentials: true
};

app.use(cors(corsConfig));

const pubsub = new PubSub();

// apollo-server-express VERSION...

// const apolloServer = new ApolloServer({
//   context: ({ req }) => {
//     return { postgres, authUtil, app, req, pubsub };
//   },
//   typeDefs,
//   resolvers
// });

// apolloServer.applyMiddleware({
//   app,
//   cors: corsConfig
// });

// app.listen(PORT, () => {
//   console.log(`Graphql Playground: http://localhost:${PORT}/graphql`);
// });

// END OF apollo-server-express VERSION...

// ####################################################################################""

// GRAPHQL-YOGA VERSION...

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ postgres, authUtil, app, req, pubsub })
});

server.express.use(app);

const options = {
  port: PORT,
  endpoint: "/graphql",
  cors: corsConfig
};

server.start(options, ({ port }) =>
  console.log(`Server started, listening on port ${port} for incoming requests.`)
);

// END OF GRAPHQL-YOGA VERSION...
