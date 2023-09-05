import { dateToString } from "../../helpers/date.js";
import { User } from "../../models/user.js";
import { Event } from "../../models/event.js";


export const user = async (userId) => {
  try {
    const userDoc = await User.findById(userId).populate("createdEvents");
    const userResponse = { ...userDoc._doc, _id: userDoc.id };
    return userResponse;
  } catch (err) {
    throw err;
  }
};

export const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (e) {
    throw e;
  }
};

export const transformBooking = (booking) => {
  return {
    ...booking._doc,
    user: user(booking._doc.user),
    event: singleEvent(booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

export const transformEvent = (event) => {
  return {
    ...event._doc,
    creator: user(event._doc.creator),
    date: dateToString(event._doc.date),
  };
};
