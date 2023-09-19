import { PropsWithChildren } from "react";
import { formatDate, fullIsoStringToReadableFormat } from "../../utils";

type CreatorType = {
  _id: string;
  email: string;
};

type EventType = {
  _id: string;
  title: string;
  date: string;
  creator: CreatorType;
  price:number
};

type BookingType = {
  _id: string;
  createdAt: string;
  event: EventType;
};

type BookingProps = {
  booking: BookingType;
  modalFn: (booking: BookingType) => void;
};

const BookingsListItem = ({
  booking,
  modalFn,
}: PropsWithChildren<BookingProps>) => {
  const { event, createdAt } = booking;

  return (
    <li className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between p-4 border-2 border-dark-bg-color w-full">
      <div className="flex flex-col gap-4 ">
        <span className="flex items-baseline gap-4">
          <h3 className="text-xl truncate w-48 md:w-32">{event.title}</h3>
          <p className="md:hidden md:translate-y-[7px] h-full ">
            {formatDate(event.date)}
          </p>
        </span>

        <div className="hidden md:flex flex-col items-start h-1/2 -translate-y-[7px] ">
          <p>Created by: {event.creator.email}</p>
          <p className="md:translate-y-[7px] h-full ">
            Date: {formatDate(event.date)}
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-4">
        <button
          className="p-2  border-2 border-light-bg-color active:actionshrink bg-dark-bg-color text-dark-text-color"
          onClick={() => modalFn(booking)}
        >
          Cancel Booking
        </button>
        <div className="hidden md:flex flex-col items-start h-1/2 translate-y-[9px] gap-1">
          <p>Booked: {fullIsoStringToReadableFormat(createdAt)}</p>
        </div>
      </div>
    </li>
  );
};

export default BookingsListItem;
