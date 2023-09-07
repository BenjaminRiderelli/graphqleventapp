import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { graphQLSchema } from "./graphql/schema/index.js";
import { rootResolver } from "./graphql/resolvers/index.js";
import { authMiddleware } from "./middleware/jwtauth.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next()
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQLSchema,
    rootValue: rootResolver,
    graphiql: true,
  })
);
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@atlascluster.cqioaqn.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
