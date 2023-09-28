import React from "react";
import { useSelector } from "react-redux";
import "./css/Header.scss";

const Header = () => {

  const user = useSelector((state) => state.user)

  return (
    <div className="header-main">
        <label className="header-label">{user.user ? user.user : "sign in"}</label>
        <label className="header-label">Log out</label>
    </div>
  );
};

export default Header;