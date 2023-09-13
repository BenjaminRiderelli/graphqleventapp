import { PropsWithChildren, useContext } from "react";
import { Context } from "../../context";
import { formatDate } from "../../utils";

type CreatorType = {
  _id: string;
  email: string;
};

type EventType = {
  _id: string;
  title: string;
  price: number;
  date: string;
  description: string;
  creator: CreatorType;
};

type EventListItemProps = {
  event: EventType;
  showDetails: (event: EventType) => void;
};

const EventListItem = ({
  event,
  showDetails,
}: PropsWithChildren<EventListItemProps>) => {
  const { _id, title, price, date, creator } = event;

  const { userSession } = useContext(Context);

  return (
    <li
      key={_id}
      className="flex justify-between p-4 border-2 border-dark-bg-color w-full"
    >
      <div className="flex flex-col gap-4 ">
        <span className="md:flex items-baseline gap-4">
          <h3 className="text-xl truncate w-24 md:w-32">{title}</h3>
          <p>{price > 0 ?`€ ${price}` : "Free!"}</p>
        </span>

        <p className="md:translate-y-[7px]">{formatDate(date)}</p>
      </div>
      <div className="flex flex-col justify-between gap-4">
        <button
          className="py-1 border-2 border-light-bg-color active:actionshrink bg-dark-bg-color text-dark-text-color"
          onClick={() => {
            showDetails(event);
          }}
        >
          View Details
        </button>
        <div className="flex items-center h-1/2 translate-y-[7px] md:translate-y-0">
          {creator._id === userSession?.userId ? (
            <p>You're the creator</p>
          ) : (
            <p>{creator?.email}</p>
          )}
        </div>
      </div>
    </li>
  );
};

export default EventListItem;
