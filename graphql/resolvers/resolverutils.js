import { dateToString } from "../../helpers/date.js";
import { User } from "../../models/user.js";
import { Event } from "../../models/event.js";
// import DataLoader from "dataloader";


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

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};


// const eventLoader = new DataLoader((eventIds) => {
//   return events(eventIds);
// });

// const userLoader = new DataLoader(userIds => {
//   return User.find({_id: {$in: userIds}});
// });
