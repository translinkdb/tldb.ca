import React from "react";
import { Link } from "react-router-dom";
import logo from "../../logo.png";
import "./Navbar.scss";

type NavbarProps = {};

export const Navbar: React.FunctionComponent<NavbarProps> = () => {
  return (
    <div className="Navbar">
      <Link to="/" className="logo-link">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
      </Link>
      <div className="navlinks">
        <Link to="/map" className="navlink">
          Map
        </Link>

        <Link to="/routes" className="navlink">
          Routes
        </Link>

        {/* <Link to="/stops" className="navlink">
          Stops
        </Link>

        <Link to="/vehicles" className="navlink">
          Vehicles
        </Link>

        <Link to="/other" className="navlink">
          Other
        </Link> */}
      </div>
    </div>
  );
};
