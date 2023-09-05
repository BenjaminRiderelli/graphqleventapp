import { Event } from "../../models/event.js";
import { Booking } from "../../models/booking.js";
import { transformBooking, transformEvent } from "./resolverutils.js";

export const bookingResolver = {

  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
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
      return transformBooking(result);
    } catch (e) {
      throw e;
    }
  },
  cancelBooking: async (args) => {
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
