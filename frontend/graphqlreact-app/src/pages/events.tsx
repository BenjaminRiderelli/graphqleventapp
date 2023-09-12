import { useState, PropsWithChildren, ChangeEvent } from "react";
import Modal from "../components/modal/modal";

type FormDataType = {
  title: string;
  price: number;
  description: string;
  date: string;
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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      return { ...prevData, [name]: value };
    });
  };

  const handleSubmit = (data: FormDataType) => {
    type KeyType = "title" | "price" | "date" | "description";
    let missingKeys: string[] = [];

    Object.keys(data).forEach((key) => {
      const value = data[key as KeyType];
      if (!value  && key !== "price") {
        missingKeys.push(key);
      }
    });
    if (missingKeys.length !== 0) {
      setMessage(`${missingKeys.join(", ")} fields are missing`);
      return;
    }
    console.log(formData);
  };

  const closeModalFn = () => {
    setMessage("");
    setFormData({ title: "", price: 0, description: "", date: "" });
    setOpenModal(false);
  };

  const { title, price, description, date } = formData;
  return (
    <main className="flex items-center justify-center w-full h-[calc(100%)] mt-16 border-2 border-t-0 border-black">
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
    </main>
  );
};

export default EventsPage;
