import React from "react";
import { BsPersonCircle } from "react-icons/bs";
import { Nav } from "react-bootstrap";
import classNames from "classnames";
import "../../css/sidebar/sidebar.scss";
import { Link } from "react-router-dom";

const SideBar = ({ isOpen }) => {
  const slugArr = window.location.pathname.split("/").slice(1);

  const isActiveUrl = (url) => {
    const slug = slugArr && slugArr[0];
    if (slug === url) return "active";
    return "";
  };

  return (
    <div className={classNames("sidebar", { "is-open": isOpen })}>
      <div className="sidebar-header">
        <h3>TeamUp</h3>
      </div>

      <Nav className="flex-column pt-2">
        <p className="side-bar-heading">Heading</p>

        <Link className="side-bar-link" to="/create-class">
          <Nav.Item className={`side-bar-item ${isActiveUrl("create-class")}`}>
            <div className="side-bar-menu">
              <BsPersonCircle />

              <span className="menu-name">Create Class</span>
            </div>
          </Nav.Item>
        </Link>

        <Link className="side-bar-link" to="/search-class">
          <Nav.Item className={`side-bar-item ${isActiveUrl("search-class")}`}>
            <div className="side-bar-menu">
              <BsPersonCircle />
              <span className="menu-name">Search Class</span>
            </div>
          </Nav.Item>
        </Link>
      </Nav>
    </div>
  );
};

export default SideBar;
