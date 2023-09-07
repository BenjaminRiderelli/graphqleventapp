import { dateToString } from "../../helpers/date.js";
import { Event } from "../../models/event.js";
import { User } from "../../models/user.js";
import { transformEvent } from "./resolverutils.js";

export const eventResolver = {
  events: async () => {
    try {
      const events = await Event.find(); // .populate("creator") --> could do it this way, but I liked the async function aproach
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args, req) => {
    
    if (!req.isAuth) {
      throw new Error("Unauthorized");
    }

    try {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: dateToString(args.eventInput.date),
        creator: req.userId,
      });

      let createdEvent;
      //save the event in DB
      const result = await event.save();
      createdEvent = transformEvent(result);

      const creator = await User.findById(req.userId);
      if (!creator) {
        throw new Error("user not found!");
      }

      //push the created event into the createdEvents array in the user model
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
