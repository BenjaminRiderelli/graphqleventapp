import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
// import { buildSchema } from "graphql";
import mongoose from "mongoose";
import dotenv from "dotenv";
// import { Event } from "./models/event.js";
// import { User } from "./models/user.js";
// import bcrypt from "bcryptjs";
import { graphQLSchema } from "./graphql/schema/index.js";
import { rootValue } from "./graphql/resolvers/index.js";

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQLSchema,
    rootValue: rootValue,
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${
      process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD}@atlascluster.cqioaqn.mongodb.net/${
      process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
