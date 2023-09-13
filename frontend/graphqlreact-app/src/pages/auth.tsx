import { useState, useContext } from "react";
import { Context } from "../context";
import { useNavigate, Navigate } from "react-router-dom";
type LoginFormInput = {
  email: string;
  password: string;
};

type RequestType = "register" | "login";

const AuthPage = () => {
  const [formInput, setFormInput] = useState<LoginFormInput>({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [requestType, setRequestType] = useState<RequestType>("login");

  const { setUserSession, userSession } = useContext(Context);

  const navigate = useNavigate();

  const handleChange = (name: string, value: string) => {
    setFormInput((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const handleSubmit = async ({ email, password }: LoginFormInput) => {
    if (email.trim().length === 0 || password.trim().length === 0) {
      setMessage("Please enter a valid email and password");
      return;
    }

    let requestBody = {};

    if (requestType === "register") {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {email: "${email}", password: "${password}"}) {
              _id
              email
            }
          }
        `,
      };
    } else if (requestType === "login") {
      requestBody = {
        query: `
          query {
            login(email:"${email}", password:"${password}"){
              userId
              token
              tokenExpiration
            }
          }
        `,
      };
    }

    try {
      const res = await fetch("http://localhost:3000/graphql", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(requestBody),
      });
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Damn, something went wrong");
      }
      const payload = await res.json();
      if (payload.errors) {
        setMessage(payload.errors[0].message);
        return;
      }
      setMessage("");
      if (payload.data.login.token) {
        const payloadData = payload.data.login;
        setUserSession(payloadData);
        navigate("/events");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const toggleRequestType = () => {
    if (requestType === "login") {
      setRequestType("register");
    } else if (requestType === "register") {
      setRequestType("login");
    }
  };

  if (userSession?.token) {
    return <Navigate to="/events" />;
  }

  return (
    <main className="flex items-center justify-center w-full h-[calc(100%)] mt-16 border-t-0 border-2 border-black">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(formInput);
        }}
        className="flex flex-col justify-center items-center  min-w-[300px] min-h-[400px] w-[400px] md:border-2 md:border-dark-bg-color"
      >
        <div className="flex flex-col w-full gap-8 p-8">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="">
              Email
            </label>
            <input
              onChange={(e) => {
                const { name, value } = e.target;
                handleChange(name, value);
              }}
              value={formInput.email}
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
              value={formInput.password}
              id="password"
              name="password"
              type="password"
              className="border-2 border-dark-bg-color p-3"
            />
          </div>

          <div className="flex justify-between gap-8">
            <button
              onClick={toggleRequestType}
              className="border-2 border-dark-bg-color p-4 active:scale-95"
              type="button"
            >
              {requestType === "register"
                ? "Switch to login"
                : "Switch to register"}
            </button>
            <button
              className="border-2 border-dark-bg-color p-4 active:scale-95"
              type="submit"
            >
              {requestType === "register" ? "Create user" : "Login"}
            </button>
          </div>
          <p className="h-4">{message}</p>
        </div>
      </form>
    </main>
  );
};

export default AuthPage;
