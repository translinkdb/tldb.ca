import React from "react";
import { Page } from "../components/page/Page";
import "./HomePage.scss";
import logo from "../logo.png";
import { Link } from "react-router-dom";

export const HomePage: React.FunctionComponent = () => {
  return (
    <Page title="Home" className="HomePage">
      <div className="content">
        <img className="logo" src={logo} alt="" />
        <h1>
          Welcome to <span className="tldb-ca">tldb.ca</span>!
        </h1>
        <h4>The site is still under construction 🚧</h4>
        <br />

        <h4>For now, you can visit:</h4>
        <h4>
          - <Link to={"/map"}>Map</Link> to see a realtime map of vehicles.
        </h4>
        <h4>
          - <Link to={"/routes"}>Routes</Link> to browse a list of routes, and
          see their operating patterns.
        </h4>
        <h4> - More to come soon!</h4>
        <br />
        <a href="https://github.com/translinkdb/tldb.ca">Github</a>
      </div>
    </Page>
  );
};
