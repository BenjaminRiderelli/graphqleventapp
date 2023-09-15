import { useState, useContext, useEffect } from "react";
import { Context } from "../context";
import Spinner from "../components/spinner/spinner";
import BookingsListItem from "../components/bookings/bookingslistitem";
import Modal from "../components/modal/modal";

type CreatorType = {
  _id: string;
  email: string;
};

type EventType = {
  _id: string;
  title: string;
  date: string;
  creator: CreatorType;
};

type Booking = {
  _id: string;
  createdAt: string;
  event: EventType;
};

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [cancelBookingModal, setCancelBookingModal] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [useEffectBool, setUseEffectBool] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { userSession } = useContext(Context);

  useEffect(() => {
    fetchBookings();
  }, [useEffectBool]);

  const fetchBookings = () => {
    setIsLoading(true);
    const requestBody = {
      query: `
          query {
            bookings {
              _id
             createdAt
              event {
               _id
               title
               date
               creator{
                _id
                email
               }
             }
            }
          }
        `,
    };

    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userSession?.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const bookings = resData.data.bookings;
        setBookings(bookings);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const openModal = (booking: Booking) => {
    setCancelBookingModal(true);
    setSelectedBooking(booking);
  };

  const cancelFn = () => {
    setSelectedBooking(null);
    setCancelBookingModal(false);
  };

  const deleteBooking = async () => {
    if (!selectedBooking?._id) {
      return;
    }
    try {
      const requestBody = {
        query: `
            mutation {
              cancelBooking(bookingId: "${selectedBooking._id}") {
              _id
               title
              }
            }
          `,
      };
      const res = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userSession?.token,
        },
      });

      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed!");
      }

      // const payload = await res.json();
      // console.log(payload)
      setUseEffectBool(!useEffectBool);
      cancelFn();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <main className="flex items-center justify-center w-full h-full mt-16 border-2 border-t-0 border-black">
      {cancelBookingModal && (
        <Modal
          btnText="Confirm"
          title="Are you sure?"
          cancelFn={cancelFn}
          confirmFn={deleteBooking}
        ></Modal>
      )}
      <ul className="flex flex-col gap-2 w-[50rem] max-w-[90%] h-[40rem] max-h-[60%] list-none p-4 overflow-y-auto">
        {isLoading && <Spinner />}
        {bookings?.map((booking) => (
          <BookingsListItem
            key={booking._id}
            modalFn={openModal}
            booking={booking}
          />
        ))}
      </ul>
    </main>
  );
};

export default BookingsPage;
