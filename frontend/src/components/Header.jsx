import React from "react";
import "./css/Header.scss";

const Header = () => {

  return (
    <div className="header-main">
        <label className="header-label">Ei käyttäjää</label>
        <label className="header-label">Log out</label>
    </div>
  );
};

export default Header;