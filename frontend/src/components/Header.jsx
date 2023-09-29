import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./css/Header.scss";
import { logOff } from "../reducers/userReducer";

const Header = ({setModal}) => {

  const user = useSelector((state) => state.user)
  const dispatch = useDispatch();

  return (
    <div className="header-main">
        <label className="header-label">{user.user ? user.user : "Not logged in"}</label>
        <label className="header-label" onClick={() => user.user ? dispatch(logOff()) : setModal(true)}>{user.user ? 'Log out' : 'Sign in'}</label>
    </div>
  );
};

export default Header;