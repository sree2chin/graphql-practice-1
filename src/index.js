const fs = require('fs');
const path = require('path');

const { ApolloServer } = require('apollo-server');

/*
  The typeDefs constant defines your GraphQL schema (more about this in a bit). 
  Here, it defines a simple Query type with one field called info. This field has the type String!. 
  The exclamation mark in the type definition means that this field is required and can never be null.

  The resolvers object is the actual implementation of the GraphQL schema. 
  Notice how its structure is identical to the structure of the type definition inside typeDefs: Query.info.

  Finally, the schema and resolvers are bundled and passed to ApolloServer which is imported from apollo-server. 
  This tells the server what API operations are accepted and how they should be resolved.

*/
// 1
let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]

/*
First, it’s important to note that every GraphQL resolver function actually receives four input arguments.
As the remaining three are not needed in our scenario right now, we’re simply omitting them. Don’t worry, you’ll get to know them soon.

The first argument, commonly called parent (or sometimes root) is the result of the previous resolver execution level. 
Hang on, what does that mean? 🤔

Well, as you already saw, GraphQL queries can be nested. Each level of nesting (i.e. nested curly braces) corresponds 
to one resolver execution level. The above query therefore has two of these execution levels.

On the first level, it invokes the feed resolver and returns the entire data stored in links. 
For the second execution level, the GraphQL server is smart enough to invoke the resolvers of the Link type (because thanks to the schema, 
it knows that feed returns a list of Link elements) for each element inside the list that was returned on the previous resolver level. 
Therefore, in all of the three Link resolvers, the incoming parent object is the element inside the links list.
*/

// 2
// const resolvers = {
//   Query: {
//     info: () => `This is the API of a Hackernews Clone`,
//     // 2
//     feed: () => links,
//   },
//   // 3
//   Link: {
//     id: (parent) => parent.id,
//     description: (parent) => parent.description,
//     url: (parent) => parent.url,
//   }
// }

// 1
let idCount = links.length
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
  },
  Mutation: {
    // 2
    post: (parent, args) => {
       const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      links.push(link)
      return link
    }
  },
}

// 3
const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
})

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );