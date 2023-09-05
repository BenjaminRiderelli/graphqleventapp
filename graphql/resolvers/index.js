import { authResolver } from "./auth.js";
import { bookingResolver } from "./booking.js";
import { eventResolver } from "./events.js";

export const rootResolver = {
  ...authResolver,
  ...bookingResolver,
  ...eventResolver,
};
