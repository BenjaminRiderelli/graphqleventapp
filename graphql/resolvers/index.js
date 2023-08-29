import { Event } from "../../models/event.js";
import { User } from "../../models/user.js";
import { Booking } from "../../models/booking.js";
import bcrypt from "bcryptjs";

const user = async (userId) => {
  try {
    const userDoc = await User.findById(userId).populate("createdEvents");
    // const userResponse = { ...userDoc._doc, _id: userDoc.id };
    return userDoc;
  } catch (err) {
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return { ...event._doc, creator: user(event._doc.creator) };
  } catch (e) {
    throw e;
  }
};

export const rootValue = {
  events: async () => {
    try {
      const events = await Event.find(); // .populate("creator") --> could do it this way, but I liked the async function aproach
      return events.map((event) => {
        return {
          ...event._doc,
          creator: user(event._doc.creator),
          date: new Date(event._doc.date).toISOString(),
        };
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args) => {
    try {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: "64ecef3badae04d87ca316c7",
      });

      let createdEvent;
      //save the event in DB
      const result = await event.save();
      createdEvent = {
        ...result._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: user(result._doc.creator),
      };

      const creator = await User.findById("64ecef3badae04d87ca316c7");
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
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return {
          ...booking._doc,
          user: user(booking._doc.user),
          event: singleEvent(booking._doc.event),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        };
      });
    } catch (err) {
      throw err;
    }
  },
  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("user already exists!");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });
      const userResult = await user.save();
      return { ...userResult._doc, password: null };
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args) => {
    try {
      const fetchedEvent = await Event.findOne({ _id: args.eventId });
      if (!fetchedEvent) {
        throw new Error(
          "The event you're tying to book is no longuer available"
        );
      }
      const booking = new Booking({
        user: "64ecef3badae04d87ca316c7",
        event: fetchedEvent,
      });
      const result = await booking.save();
      return {
        ...result._doc,
        user: user(booking._doc.user),
        event: singleEvent(booking._doc.event),
        createdAt: new Date(result._doc.createdAt).toISOString(),
        updatedAt: new Date(result._doc.updatedAt).toISOString(),
      };
    } catch (e) {
      throw e;
    }
  },
  cancelBooking: async (args) => {
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = {
        ...booking.event._doc,
        creator: user(booking.event._doc.creator),
      };
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
