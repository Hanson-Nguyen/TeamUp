import React from "react";
import { BsPersonCircle } from "react-icons/bs";
import { Nav } from "react-bootstrap";
import classNames from "classnames";
import "../../css/sidebar/sidebar.scss";
import { Link } from "react-router-dom";
import { useAuth } from "../auth-provider";

const SideBar = ({ isOpen }) => {
  const slugArr = window.location.pathname.split("/").slice(1);

  const {role} = useAuth();

  const isActiveUrl = (url) => {
    const slug = slugArr && slugArr[0];
    if (slug === url) return "active";
    return "";
  };

  const BasicView = () => (
    <Nav className="flex-column pt-2">
        <Link className="side-bar-link" to="/dashboard/search-class">
          <Nav.Item className={`side-bar-item ${isActiveUrl("/dashboard/search-class")}`}>
            <div className="side-bar-menu">
              <BsPersonCircle />
              <span className="menu-name">View Projects</span>
            </div>
          </Nav.Item>
        </Link>
      </Nav>
  )
  const ContributorView = () => (
    <Nav className="flex-column pt-2">
        <Link className="side-bar-link" to="/dashboard/search-class">
          <Nav.Item className={`side-bar-item ${isActiveUrl("search-class")}`}>
            <div className="side-bar-menu">
              <BsPersonCircle />
              <span className="menu-name">View Projects</span>
            </div>
          </Nav.Item>
        </Link>
      </Nav>
  )
  const AdminView = () => (
    <Nav className="flex-column pt-2">
    <Link className="side-bar-link" to="/dashboard/admin">
      <Nav.Item className={`side-bar-item ${isActiveUrl("/dashboard/admin")}`}>
        <div className="side-bar-menu">
          <BsPersonCircle />

          <span className="menu-name">View Users</span>
        </div>
      </Nav.Item>
    </Link>

    <Link className="side-bar-link" to="/dashboard/search-class">
      <Nav.Item className={`side-bar-item ${isActiveUrl("/dashboard/search-class")}`}>
        <div className="side-bar-menu">
          <BsPersonCircle />
          <span className="menu-name">View Projects</span>
        </div>
      </Nav.Item>
    </Link>
  </Nav>
  )
  return (
    <div className={classNames("sidebar", { "is-open": isOpen })}>
      <div className="sidebar-header">
        <h3>TeamUp</h3>
      </div>

      {role === 'basic' ? BasicView() : false}
      {role === 'contributor' ? ContributorView() : false }
      {role === 'admin' ? AdminView() : false}

    </div>
  );
};

export default SideBar;
