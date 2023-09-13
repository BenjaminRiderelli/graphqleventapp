import {
  useState,
  PropsWithChildren,
  ChangeEvent,
  useContext,
  useEffect,
} from "react";
import Modal from "../components/modal/modal";
import { Context } from "../context";

type FormDataType = {
  title: string;
  price: number;
  description: string;
  date: string;
};

type CreatorType = {
  _id: string;
  email: string;
};

type EventType = {
  _id: string;
  title: string;
  price: number;
  description: string;
  date: string;
  creator: CreatorType;
};

const FormControl = ({ children }: PropsWithChildren) => {
  return <div className="flex flex-col gap-1">{children}</div>;
};

const EventsPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    price: 0,
    description: "",
    date: "",
  });
  const [eventsList, setEventsList] = useState<EventType[]>([]);
  const { userSession } = useContext(Context);

  useEffect(() => {
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `,
    };
    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((payload) => {
        console.log(payload.data.events);
        setEventsList(payload.data.events);
      });
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      return { ...prevData, [name]: value };
    });
  };

  const handleSubmit = async (data: FormDataType) => {
    type KeyType = "title" | "price" | "date" | "description";
    let missingKeys: string[] = [];

    Object.keys(data).forEach((key) => {
      const value = data[key as KeyType];
      if (!value && key !== "price") {
        missingKeys.push(key);
      }
    });
    if (missingKeys.length !== 0) {
      setMessage(`${missingKeys.join(", ")} fields are missing`);
      return;
    }
    const requestBody = {
      query: `
          mutation {
            createEvent(eventInput: {title: "${title}", 
            description: "${description}", 
            price: ${Number(price)}, 
            date: "${date}"}) {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
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

    const payload = await res.json();
    closeModalFn();
    return payload;
  };

  const closeModalFn = () => {
    setMessage("");
    setFormData({ title: "", price: 0, description: "", date: "" });
    setOpenModal(false);
  };

  const { title, price, description, date } = formData;
  return (
    <main className="flex flex-col items-center justify-center gap-8 w-full h-[calc(100%)] mt-16 border-2 border-t-0 border-black">
      {openModal && (
        <Modal
          title="Create an event"
          cancelFn={closeModalFn}
          confirmFn={() => {
            handleSubmit(formData);
          }}
        >
          <form className="flex flex-col gap-4">
            <p className="h-4 mb-8">{message}</p>
            <FormControl>
              <label htmlFor="title">Title</label>
              <input
                className="border-2 border-dark-bg-color rounded px-2 py-1"
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <label htmlFor="price">€ - Price</label>
              <input
                className="border-2 border-dark-bg-color rounded px-2 py-1"
                type="number"
                id="price"
                name="price"
                value={price}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <label htmlFor="date">Date</label>
              <input
                className="border-2 border-dark-bg-color rounded px-2 py-1"
                type="datetime-local"
                id="date"
                value={date}
                name="date"
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <label htmlFor="description">Description</label>
              <textarea
                className="border-2 border-dark-bg-color rounded px-2 py-1"
                id="description"
                value={description}
                name="description"
                rows={4}
                onChange={handleChange}
              />
            </FormControl>
          </form>
        </Modal>
      )}
      {userSession?.token && (
        <div className="flex flex-col gap-6 justify-center items-center border-2 border-dark-bg-color w-3/4 h-40 ">
          <p className="w-full text-center">Share your own events!</p>
          <button
            onClick={() => {
              setOpenModal(true);
            }}
            className=" md:flex border-2 border-dark-bg-color px-2 py-1 active:scale-95"
          >
            Create Event
          </button>
        </div>
      )}
      <ul className="flex flex-col gap-2 w-[40rem] max-w-[90%] h-[40rem] max-h-[60%] list-none p-4 overflow-scroll">
        {eventsList.map((event) => {
          return <li className="p-4 border-2 border-dark-bg-color">{event.title}</li>;
        })}
      </ul>
    </main>
  );
};

export default EventsPage;
