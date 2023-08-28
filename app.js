import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()



const app = express();

const events = [];

app.use(bodyParser.json());
app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`

        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput{
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery{
            events: [Event!]!
        }

        type RootMutation{
            createEvent(eventInput:EventInput!):Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }

    `),
    rootValue: {
      events: () => {
        return events;
      },
      createEvent: (args) => {
        const event = {
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          date: args.eventInput.date,
          price: +args.eventInput.price,
        };

        events.push(event);
        return event;
      },
    },
    graphiql: true,
  })
);


mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@atlascluster.cqioaqn.mongodb.net/?retryWrites=true&w=majority`
);
app.listen(3000);
