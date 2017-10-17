import express from "express";
import bodyParser from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import fetch from "isomorphic-unfetch";
import next from "next";

const typeDefs = [
  `
  type Node {
    id: ID!,
    name: String!
  }

  type Query {
     nodes: [Node]!
   }

  schema {
    query: Query
  }`
];

const resolvers = {
  Query: {
    async nodes() {
      const res = await fetch("http://localhost:3000/mock");
      const data = await res.json();
      return Object.keys(data).map(key => data[key]);
    }
  }
};

const dev = process.env.NODE_ENV !== "production";
const app = next({ dir: "./src", dev });
const handle = app.getRequestHandler();

const Schema = makeExecutableSchema({ typeDefs, resolvers });

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(
      "/graphql",
      bodyParser.json(),
      graphqlExpress({ schema: Schema })
    );

    server.get("/graphiql", graphiqlExpress({ endpointURL: "/graphql" })); // if you want GraphiQL enabled

    server.get("/mock", (req, res) => {
      return res.json({
        a1: { id: "a1", name: "node1" },
        a2: { id: "a2", name: "node2" }
      });
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, err => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
