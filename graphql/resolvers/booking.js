import { Event } from "../../models/event.js";
import { Booking } from "../../models/booking.js";
import { transformBooking, transformEvent } from "./resolverutils.js";

export const bookingResolver = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthorized");
    }
    try {
      const bookings = await Booking.find({ user: req.userId });
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthorized");
    }
    try {
      const fetchedEvent = await Event.findOne({ _id: args.eventId });
      if (!fetchedEvent) {
        throw new Error(
          "The event you're tying to book is no longuer available"
        );
      }
      const bookingCheck = await Booking.find({
        event: fetchedEvent._id,
        user: req.userId,
      });

      if (bookingCheck.length > 0) {
        throw new Error(
          "You're already booked fot his event"
        );
      }
      const booking = new Booking({
        user: req.userId,
        event: fetchedEvent,
      });
      const result = await booking.save();
      return transformBooking(result);
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthorized");
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
