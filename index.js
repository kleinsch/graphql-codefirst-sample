const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require('@apollo/server/standalone');
const { GraphQLObjectType, GraphQLSchema, GraphQLNonNull, GraphQLString, GraphQLID} = require("graphql");

// Consider this function unchangeable, it's a massive code-first schema
const createSchema = function() {
  const users = [
    {
      id: "1",
      name: "Ada Lovelace",
      birthDate: "1815-12-10",
      username: "@ada"
    },
    {
      id: "2",
      name: "Alan Turing",
      birthDate: "1912-06-23",
      username: "@complete"
    }
  ];

  const userType = new GraphQLObjectType({
    name: 'User',
    description: 'User Type Definition',
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLID),
      },
      name: {
        type: GraphQLString,
      },
      username: {
        type: GraphQLString,
      },
    }),
    extensions: {
      foo: 'bar',
    },
  });
  
  const userQueries = {
    me: {
      type: userType,
      description: 'Return users',
      resolve: () => {
        return users[0];
      },
    },
  };
  
  const query = new GraphQLObjectType({
    name: 'Query',
    description: 'Queries',
    fields: userQueries,
  });
  
  return new GraphQLSchema({
    query,
    types: [userType],
  });
};

(async () => {
  const schema = createSchema();
  
  // TODO - how can we use this with buildSubgraphSchema?
  // const server = new ApolloServer({ buildSubgraphSchema(schema) });

  const server = new ApolloServer({ schema });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀 Server ready at ${url}`);
})();
