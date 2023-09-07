import { useState } from "react";

type LoginFormInput = {
  email: string;
  password: string;
};

const AuthPage = () => {
  const [formInput, setFormInput] = useState<LoginFormInput>({
    email: "",
    password: "",
  });

  const handleChange = (name: string, value: string) => {
    setFormInput((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const handleSubmit = ({ email, password }: LoginFormInput) => {
    console.log(email, password)
  };

  return (
    <main className="flex items-center justify-center w-full h-[calc(100%)] mt-16 border-t-0 border-2 border-black">
      <form className="flex flex-col justify-center items-center md:border-2 border-dark-bg-color min-w-[300px] min-h-[400px] w-[500px] gap-8 ">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="">
            Email
          </label>
          <input
            onChange={(e) => {
              const { name, value } = e.target;
              handleChange(name, value);
            }}
            id="email"
            name="email"
            type="email"
            className="border-2 border-dark-bg-color p-3"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="">
            Password
          </label>
          <input
            onChange={(e) => {
              const { name, value } = e.target;
              handleChange(name, value);
            }}
            id="password"
            name="password"
            type="password"
            className="border-2 border-dark-bg-color p-3"
          />
        </div>

        <div className="flex justify-between gap-8">
          <button
            className="border-2 border-dark-bg-color p-4 active:scale-95"
            type="button"
          >
            Switch to sign up
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(formInput);
            }}
            className="border-2 border-dark-bg-color p-4 active:scale-95"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </main>
  );
};

export default AuthPage;
