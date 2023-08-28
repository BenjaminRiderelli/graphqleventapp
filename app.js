import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Event } from "./models/event.js";
import { User } from "./models/user.js";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();

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

        type User{
            _id:ID!
            email:String!
            password:String
        }


        input EventInput{
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput {
            email:String!
            password:String!
        }

        type RootQuery{
            events: [Event!]!
        }

        type RootMutation{
            createEvent(eventInput:EventInput!):Event
            createUser(userInput: UserInput):User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }

    `),
    rootValue: {
      events: () => {
        return Event.find()
          .then((events) => {
            return events.map((event) => {
              return { ...event._doc };
            });
          })
          .catch((err) => {
            throw err;
          });
      },
      createEvent: (args) => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: "64ecef3badae04d87ca316c7",
        });

        let createdEvent
        return event
          .save()
          .then((result) => {
            createdEvent = { ...result._doc }
            return User.findById("64ecef3badae04d87ca316c7");
          })
          .then((user) => {
            if (!user) {
              throw new Error("user not found!");
            }
            user.createdEvents.push(event);
            return user.save()
          })
          .then((result) => {
            console.log(result);
            return createdEvent;
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
      createUser: (args) => {
        return User.findOne({ email: args.userInput.email })
          .then((user) => {
            if (user) {
              throw new Error("user already exists!");
            }
            return bcrypt.hash(args.userInput.password, 12);
          })
          .then((hashedPassword) => {
            const user = new User({
              email: args.userInput.email,
              password: hashedPassword,
            });
            return user.save();
          })
          .then((result) => {
            return { ...result._doc, password: null };
          })
          .catch((err) => {
            throw err;
          });
      },
    },
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
