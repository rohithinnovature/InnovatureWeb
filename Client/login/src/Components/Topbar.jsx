import React, { useState } from "react";
import "./Topbar.css";
import { GiHamburgerMenu } from "react-icons/gi";

const Topbar = ({ logotext }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header className="topbar">
      <div className="logo">{logotext}</div>
      <nav className="nav">
        <div className="menu-icon" onClick={toggleMenu}>
          <GiHamburgerMenu />
        </div>
        <ul className={`menu-items ${showMenu ? "show" : ""}`}>
          <li>
            <a href="/dashboard">Dashboard</a>
          </li>
          <li>
            <a href="/settings">Settings</a>
          </li>
          <li>
            <a href="/profile">Profile</a>
          </li>
          <li>
            <a href="/">Logout</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Topbar;
