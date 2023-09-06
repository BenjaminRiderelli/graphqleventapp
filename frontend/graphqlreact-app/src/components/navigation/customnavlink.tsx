import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

type CustomNavLinkProps = {
  children: ReactNode;
  to: string;
};

const CustomNavLink = ({ children, to }: CustomNavLinkProps) => {
  return (
    <NavLink
      className="pb-1 hover:border-dark-bg-color hover:border-b-2"
      to={to}
      style={({ isActive }) => ({
        borderBottom: isActive
          ? "2px solid var(--dark-bg-color)"
          : "",
      })}
    >
      {children}
    </NavLink>
  );
};

export default CustomNavLink;
