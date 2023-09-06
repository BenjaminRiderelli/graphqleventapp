import { useState } from "react";
import CustomNavLink from "./customnavlink";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const MainNavigation = () => {
  const [nav, setNav] = useState(false);

  return (
    <header
      className={`fixed top-0 flex justify-between items-center ${
        nav ? "" : "border-2"
      } border-dark-bg-color w-full h-16 p-4 px-16 text-2xl`}
    >
      <div>
        <h1 className="font-black text-2xl">Easy Booking</h1>
      </div>
      <nav>
        <AiOutlineMenu
          className="md:hidden"
          style={{ fontSize: "2rem" }}
          onClick={() => setNav(true)}
        />
        <ul className="hidden md:flex gap-8">
          <li>
            <CustomNavLink to="/auth">Home</CustomNavLink>
          </li>
          <li>
            <CustomNavLink to="/events">Events</CustomNavLink>
          </li>
          <li>
            <CustomNavLink to="/bookings">Bookings</CustomNavLink>
          </li>
        </ul>
      </nav>
      <div className="hidden md:flex">something</div>
      <aside
        className={`${
          nav
            ? "text-light-text-color  transform translate-x-1/2"
            : "opacity-0 transform -translate-x-full"
        } transition-transform absolute top-0 right-1/2 w-full h-screen  bg-transparent flex justify-start items-start text-2xl`}
        onClick={() => setNav(false)}
      >
        <div className=" bg-light-bg-color z-50 w-2/3 h-full px-6 py-8 ">
          <div className="flex flex-col justify-between h-1/2">
            <div className="flex justify-between w-full">
              <h2 className="font-black text-2xl">Easy Booking</h2>
              <AiOutlineClose
                className="md:hidden"
                style={{ fontSize: "2rem" }}
                onClick={() => setNav(true)}
              />
            </div>
            <ul className="flex flex-col gap-6">
              <li className="text-lg">
                <CustomNavLink to="/auth">Home</CustomNavLink>
              </li>
              <li className="text-lg">
                <CustomNavLink to="/events">Events</CustomNavLink>
              </li>
              <li className="text-lg">
                <CustomNavLink to="/bookings">Bookings</CustomNavLink>
              </li>
            </ul>
            <div className="flex flex-col w-full h-32 gap-4"></div>
          </div>
        </div>
        <div className="w-1/3 h-full bg-dark-bg-color opacity-75"></div>
      </aside>
    </header>
  );
};

export default MainNavigation;